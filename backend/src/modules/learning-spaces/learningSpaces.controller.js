import * as service from "./learningSpaces.service.js";

export async function list(req, res, next) {
  try {
    const spaces = await service.listForUser(req.user.id);
    res.json(spaces);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { name, colorId, icon } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "name is required." });
    }
    const space = await service.create(req.user.id, {
      name: String(name).trim(),
      colorId: colorId || "purple",
      icon: icon || "bot",
    });
    res.status(201).json(space);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const space = await service.getDetails(req.user.id, Number(req.params.id));
    if (!space) return res.status(404).json({ error: "Learning space not found." });
    res.json(space);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { name, colorId, icon } = req.body;
    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ error: "name cannot be empty." });
    }
    const updated = await service.update(req.user.id, Number(req.params.id), {
      ...(name !== undefined && { name: String(name).trim() }),
      ...(colorId !== undefined && { colorId }),
      ...(icon !== undefined && { icon }),
    });
    if (!updated) return res.status(404).json({ error: "Learning space not found." });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await service.remove(req.user.id, Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Learning space not found." });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
