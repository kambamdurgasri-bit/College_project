import * as profileService from "./profile.service.js";

export async function getProfile(req, res) {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const updated = await profileService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new password are required" });
    }
    const result = await profileService.changePassword(req.user.id, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
