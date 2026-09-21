import * as service from "./topics.service.js";

const MAX_TOPIC_NAME_LENGTH = 100; // matches VarChar(100) in the schema

function readTopicId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateName(name) {
  const clean = String(name ?? "").trim();
  if (!clean) return { error: "name is required." };
  if (clean.length > MAX_TOPIC_NAME_LENGTH) {
    return { error: `name must be ${MAX_TOPIC_NAME_LENGTH} characters or fewer.` };
  }
  return { value: clean };
}

export async function list(req, res, next) {
  try {
    const learningSpaceId = Number(req.params.id ?? req.query.learningSpaceId);
    if (!Number.isInteger(learningSpaceId) || learningSpaceId <= 0) {
      return res.status(400).json({ error: "learningSpaceId is required." });
    }
    const topics = await service.listForSpace(req.user.id, learningSpaceId);
    if (topics === null) {
      return res.status(404).json({ error: "Learning space not found." });
    }
    res.json(topics);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { learningSpaceId, name, description } = req.body;
    const spaceId = Number(learningSpaceId);

    if (!Number.isInteger(spaceId) || spaceId <= 0) {
      return res.status(400).json({ error: "learningSpaceId is required." });
    }

    const validated = validateName(name);
    if (validated.error) return res.status(400).json({ error: validated.error });

    const topic = await service.create(req.user.id, {
      learningSpaceId: spaceId,
      name: validated.value,
      description,
    });
    if (!topic) return res.status(404).json({ error: "Learning space not found." });

    res.status(201).json(topic);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const id = readTopicId(req);
    if (!id) return res.status(400).json({ error: "Invalid topic id." });

    const topic = await service.getOne(req.user.id, id);
    if (!topic) return res.status(404).json({ error: "Topic not found." });
    res.json(topic);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = readTopicId(req);
    if (!id) return res.status(400).json({ error: "Invalid topic id." });

    const { name, description } = req.body;
    if (name === undefined && description === undefined) {
      return res.status(400).json({ error: "Provide a name or description to update." });
    }

    let cleanName;
    if (name !== undefined) {
      const validated = validateName(name);
      if (validated.error) return res.status(400).json({ error: validated.error });
      cleanName = validated.value;
    }

    const topic = await service.update(req.user.id, id, {
      ...(name !== undefined && { name: cleanName }),
      ...(description !== undefined && { description }),
    });
    if (!topic) return res.status(404).json({ error: "Topic not found." });
    res.json(topic);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = readTopicId(req);
    if (!id) return res.status(400).json({ error: "Invalid topic id." });

    const deleted = await service.remove(req.user.id, id);
    if (!deleted) return res.status(404).json({ error: "Topic not found." });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
