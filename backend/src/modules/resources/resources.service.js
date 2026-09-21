import prisma from "../../lib/prisma.js";
import * as learningSpaces from "../learning-spaces/learningSpaces.service.js";
import { removeStoredFile } from "../../lib/storage.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Reads ----------------------------------------------------------------

export async function getMany(userId, resourceIds) {
  if (!Array.isArray(resourceIds) || resourceIds.length === 0) return [];

  const resources = await prisma.resources.findMany({
    where: {
      id: { in: resourceIds },
      userId,
    },
    include: { topic: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return resources.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    url: r.url,
    filePath: r.filePath,
    mimeType: r.mimeType,
    fileSize: r.fileSize,
    content: r.content,
    extractedText: r.extractedText,
    topicId: r.topicId,
    topicName: r.topic?.name || null,
    createdAt: r.createdAt,
  }));
}

export async function listForSpace(userId, learningSpaceId) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  const resources = await prisma.resources.findMany({
    where: { learningSpaceId },
    include: { topic: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return resources.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    url: r.url,
    filePath: r.filePath,
    mimeType: r.mimeType,
    fileSize: r.fileSize,
    content: r.content,
    extractedText: r.extractedText,
    topicId: r.topicId,
    topicName: r.topic?.name || null,
    createdAt: r.createdAt,
  }));
}

export async function listForTopic(userId, topicId) {
  const topic = await prisma.topics.findUnique({
    where: { id: topicId },
    include: { learningSpace: { select: { userId: true } } },
  });
  if (!topic || topic.learningSpace.userId !== userId) return null;

  const resources = await prisma.resources.findMany({
    where: { topicId },
    orderBy: { createdAt: "desc" },
  });

  return resources.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    url: r.url,
    filePath: r.filePath,
    mimeType: r.mimeType,
    fileSize: r.fileSize,
    content: r.content,
    extractedText: r.extractedText,
    createdAt: r.createdAt,
  }));
}

export async function getOne(userId, resourceId) {
  const resource = await prisma.resources.findUnique({
    where: { id: resourceId },
    include: { topic: { select: { id: true, name: true } } },
  });
  if (!resource || resource.userId !== userId) return null;

  return {
    id: resource.id,
    title: resource.title,
    type: resource.type,
    url: resource.url,
    filePath: resource.filePath,
    mimeType: resource.mimeType,
    fileSize: resource.fileSize,
    content: resource.content,
    extractedText: resource.extractedText,
    topicId: resource.topicId,
    topicName: resource.topic?.name || null,
    createdAt: resource.createdAt,
  };
}

// Lazy pdf-parse import so the "Indexing all PDF objects" warning only
// runs when we actually parse a PDF (not on every server start).
let pdfParse = null;
async function loadPdfParse() {
  if (!pdfParse) pdfParse = await import("pdf-parse");
  return pdfParse.default || pdfParse;
}

// --- Writes ---------------------------------------------------------------

export class ResourceConflictError extends Error {
  constructor(title) {
    super(`A resource named "${title}" already exists.`);
    this.name = "ResourceConflictError";
    this.status = 409;
  }
}

function resourceFromData(data, file) {
  if (file) {
    return {
      title: data.title || file.originalname,
      type: file.mimetype.startsWith("application/pdf") ? "PDF" : "IMAGE",
      filePath: file.path,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  if (data.url) {
    if (data.url.match(/youtube\.com|youtu\.be/i)) {
      return { title: data.title || "YouTube Video", type: "YOUTUBE", url: data.url };
    }
    return { title: data.title || "Link", type: "LINK", url: data.url };
  }

  if (data.content) {
    return { title: data.title || "Notes", type: "NOTE", content: data.content };
  }

  throw new Error("Invalid resource data: provide a file, url, or content.");
}

export async function create(userId, { learningSpaceId, topicId, data, file }) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  const resourceData = resourceFromData(data, file);
  const title = resourceData.title;

  const resource = await prisma.resources.create({
    data: {
      userId,
      learningSpaceId,
      topicId: topicId || null,
      title,
      type: resourceData.type,
      url: resourceData.url || null,
      filePath: resourceData.filePath || null,
      mimeType: resourceData.mimeType || null,
      fileSize: resourceData.fileSize || null,
      content: resourceData.content || null,
    },
  });

  let extractedText = null;
  if (resource.type === "PDF" && resource.filePath) {
    try {
      const pdfPath = path.resolve(__dirname, "../../..", resource.filePath);
      const pdfData = await fs.readFile(pdfPath);
      const pdfModule = await loadPdfParse();
      const parsed = await pdfModule(pdfData);
      extractedText = parsed.text?.trim();
    } catch (err) {
      console.warn("Could not extract text from PDF:", resource.id, err.message);
    }

    if (extractedText) {
      await prisma.resources.update({
        where: { id: resource.id },
        data: { extractedText },
      });
    }
  }

  return {
    id: resource.id,
    title: resource.title,
    type: resource.type,
    url: resource.url,
    filePath: resource.filePath,
    mimeType: resource.mimeType,
    fileSize: resource.fileSize,
    content: resource.content,
    extractedText,
    topicId: resource.topicId,
    createdAt: resource.createdAt,
  };
}

export async function remove(userId, resourceId) {
  const resource = await prisma.resources.findUnique({
    where: { id: resourceId },
    include: { learningSpace: { select: { userId: true } } },
  });
  if (!resource || resource.learningSpace.userId !== userId) return null;

  if (resource.filePath) {
    await removeStoredFile(resource.filePath);
  }

  await prisma.resources.delete({ where: { id: resourceId } });
  return true;
}
