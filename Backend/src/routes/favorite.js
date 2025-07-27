import express from "express";
import Favorite from "../models/Favorite.js";
import authMiddleware from "../middlewares/auth.js"; // token kontrolü için

const router = express.Router();

// Favori Ekle
router.post("/", authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const exists = await Favorite.findOne({ userId, productId });
  if (exists) return res.status(400).json({ message: "Zaten favoride." });

  const favorite = new Favorite({ userId, productId });
  await favorite.save();
  res.status(201).json(favorite);
});

// Favoriden Kaldır
router.delete("/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  await Favorite.findOneAndDelete({ userId, productId });
  res.json({ message: "Favoriden kaldırıldı." });
});

// Kullanıcının Favorileri
router.get("/", authMiddleware, async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).populate("productId");
  res.json(favorites);
});

export default router;
