// backend/routes/notifications.js
import express from "express";
import Notifications from "../models/Notifications.js";
import Users from "../models/Users.js";   // ✔ EKLENMESİ GEREKEN SATIR
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Kullanıcıya özel bildirimleri çek
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notifications.find({
      user: userId,
      hiddenBy: { $ne: userId }  // gizlenmiş olanları gösterme
    }).sort({ createdAt: -1 });

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

    let recipients = userIds || [];

    if (recipients.length === 0) {
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


// Okunmamış bildirim sayısı
router.get("/unread", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notifications.countDocuments({
      user: userId,
      read: false
    });

    res.status(200).json({ count });
  } catch (err) {
    console.error("Unread count hatası:", err.message);
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


// Bildirimi kullanıcı özelinde gizle (silme değil)
router.post("/:id/hide", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;

    const notification = await Notifications.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Bildirim bulunamadı." });
    }

    // Eğer zaten gizlenmişse tekrar ekleme
    if (!notification.hiddenBy.includes(userId)) {
      notification.hiddenBy.push(userId);
      await notification.save();
    }

    res.status(200).json({ message: "Bildirim gizlendi." });
  } catch (err) {
    console.error("Bildirim gizleme hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});




export default router;
