// File storage for uploaded study resources (PDF / image).
//
// Everything filesystem-specific lives here so swapping local disk for
// object storage later only touches this module.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

// backend/uploads by default; override with UPLOAD_DIR.
export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(currentDir, "../../uploads");

export const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB

export const ALLOWED_MIME_TYPES = {
  "application/pdf": "PDF",
  "image/png": "IMAGE",
  "image/jpeg": "IMAGE",
  "image/webp": "IMAGE",
  "image/gif": "IMAGE",
};

export function resourceTypeFromMime(mimeType) {
  return ALLOWED_MIME_TYPES[mimeType] || null;
}

function safeBaseName(originalName) {
  return path
    .basename(originalName || "resource")
    .replace(/[^\w.\-]+/g, "_")
    .slice(-80);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(UPLOAD_DIR, { recursive: true })
      .then(() => cb(null, UPLOAD_DIR))
      .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id ?? "anon";
    cb(null, `${userId}-${Date.now()}-${safeBaseName(file.originalname)}`);
  },
});

export const uploadResourceFile = multer({
  storage,
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      const error = new Error(
        "Unsupported file type. Upload a PDF or an image (PNG, JPEG, WEBP, GIF)."
      );
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

// Best-effort cleanup — a missing file must never fail an API request.
export async function removeStoredFile(fileName) {
  if (!fileName) return false;
  const target = path.resolve(UPLOAD_DIR, path.basename(fileName));
  if (!target.startsWith(UPLOAD_DIR)) return false;
  try {
    await fs.unlink(target);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn("Could not delete stored file:", fileName, err.message);
    }
    return false;
  }
}

export async function readStoredFile(fileName) {
  const target = path.resolve(UPLOAD_DIR, path.basename(fileName));
  if (!target.startsWith(UPLOAD_DIR)) return null;
  try {
    return await fs.readFile(target);
  } catch {
    return null;
  }
}

export function publicPathFor(fileName) {
  return fileName ? `/uploads/${path.basename(fileName)}` : null;
}
