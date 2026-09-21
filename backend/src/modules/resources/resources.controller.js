import * as service from "./resources.service.js";
import * as topicsService from "../topics/topics.service.js";
import { uploadResourceFile } from "../../lib/storage.js";
import multer from "multer";

function readUserId(req) {
  return req.user?.id;
}

function readResourceId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function list(req, res, next) {
  try {
    const learningSpaceId = Number(req.query.learningSpaceId);
    if (!Number.isInteger(learningSpaceId) || learningSpaceId <= 0) {
      return res.status(400).json({ error: "learningSpaceId query param is required." });
    }
    const resources = await service.listForSpace(req.user.id, learningSpaceId);
    if (resources === null) {
      return res.status(404).json({ error: "Learning space not found." });
    }
    res.json(resources);
  } catch (err) {
    next(err);
  }
}

export async function listForTopic(req, res, next) {
  try {
    const topicId = Number(req.params.topicId);
    if (!Number.isInteger(topicId) || topicId <= 0) {
      return res.status(400).json({ error: "Invalid topic id." });
    }
    const resources = await service.listForTopic(req.user.id, topicId);
    if (resources === null) {
      return res.status(404).json({ error: "Topic not found." });
    }
    res.json(resources);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const id = readResourceId(req);
    if (!id) return res.status(400).json({ error: "Invalid resource id." });

    const resource = await service.getOne(req.user.id, id);
    if (!resource) return res.status(404).json({ error: "Resource not found." });
    res.json(resource);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const learningSpaceId = Number(req.body.learningSpaceId);
    const topicId = req.body.topicId ? Number(req.body.topicId) : undefined;

    if (!Number.isInteger(learningSpaceId) || learningSpaceId <= 0) {
      return res.status(400).json({ error: "learningSpaceId is required." });
    }

    if (req.file) {
      const resource = await service.create(req.user.id, {
        learningSpaceId,
        topicId,
        data: { title: req.body.title },
        file: req.file,
      });
      return res.status(201).json(resource);
    }

    const resource = await service.create(req.user.id, {
      learningSpaceId,
      topicId,
      data: {
        title: req.body.title,
        url: req.body.url,
        content: req.body.content,
      },
    });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
}

export async function createForTopic(req, res, next) {
  try {
    const topicId = Number(req.params.topicId);
    if (!Number.isInteger(topicId) || topicId <= 0) {
      return res.status(400).json({ error: "Invalid topic id." });
    }

    const topic = await topicsService.getOne(req.user.id, topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    if (req.file) {
      const resource = await service.create(req.user.id, {
        learningSpaceId: topic.learningSpaceId,
        topicId,
        data: { title: req.body.title },
        file: req.file,
      });
      return res.status(201).json(resource);
    }

    const resource = await service.create(req.user.id, {
      learningSpaceId: topic.learningSpaceId,
      topicId,
      data: {
        title: req.body.title,
        url: req.body.url,
        content: req.body.content,
      },
    });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = readResourceId(req);
    if (!id) return res.status(400).json({ error: "Invalid resource id." });

    const deleted = await service.remove(req.user.id, id);
    if (!deleted) return res.status(404).json({ error: "Resource not found." });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
