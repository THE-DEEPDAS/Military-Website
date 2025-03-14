const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const NotificationAlert = require("../models/NotificationAlert");

// Get all notifications for a user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await NotificationAlert.find({
      user: req.user.id,
    }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a notification as read
router.put("/:id", auth, async (req, res) => {
  try {
    const notification = await NotificationAlert.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
