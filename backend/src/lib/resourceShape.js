// Pure shaping helper for resource rows, shared by the resources module and
// the learning-spaces details endpoint.

import { publicPathFor } from "./storage.js";

export const resourceInclude = {
  topic: { select: { id: true, name: true } },
  _count: { select: { quizzes: true } },
};

export function shapeResource(resource) {
  return {
    id: resource.id,
    learningSpaceId: resource.learningSpaceId,
    topicId: resource.topicId,
    topicName: resource.topic?.name ?? null,
    title: resource.title,
    type: resource.type,
    url: resource.url,
    fileUrl: publicPathFor(resource.filePath),
    mimeType: resource.mimeType,
    fileSize: resource.fileSize,
    noteContent: resource.content,
    hasExtractedText: Boolean(resource.extractedText),
    extractedTextLength: resource.extractedText?.length ?? 0,
    quizzesCount: resource._count?.quizzes ?? 0,
    createdAt: resource.createdAt,
  };
}
