// backend/routes/notifications.js
import express from "express";
import Notifications from "../models/Notifications.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Kullanıcıya özel bildirimleri çek
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notifications.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Bildirim çekme hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

// Admin veya sistem bildirimi ekle
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { message, userIds, type, referenceId } = req.body;
    if (!message) return res.status(400).json({ message: "Mesaj gerekli." });

    let recipients = userIds || []; // boşsa toplu gönderim yapılabilir

    // Eğer userIds boşsa -> tüm kullanıcıya gönder
    if (recipients.length === 0) {
      // TODO: Burada Users modelinden tüm kullanıcıları çekebiliriz
      const allUsers = await Users.find({}, "_id");
      recipients = allUsers.map((u) => u._id);
    }

    const notifications = recipients.map((userId) => ({
      user: userId,
      message,
      type: type || "system",
      referenceId: referenceId || null,
    }));

    await Notifications.insertMany(notifications);
    res.status(201).json({ message: "Bildirim gönderildi." });
  } catch (err) {
    console.error("Bildirim ekleme hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

// Bildirimi okundu olarak işaretle
router.post("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notifications.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Bildirim bulunamadı." });

    notification.read = true;
    await notification.save();
    res.status(200).json({ message: "Bildirim okundu." });
  } catch (err) {
    console.error("Bildirim okundu hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

export default router;
