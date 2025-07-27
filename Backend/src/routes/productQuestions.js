import express from "express";
import ProductQuestion from "../models/ProductQuestion.js";
import Product from "../models/Products.js";
import authMiddleware from "../middlewares/auth.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// === Kullanıcı SORU SORAR ===
router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    // Ürün kontrolü
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    const newQuestion = new ProductQuestion({
      product: productId,
      user: userId,
      question,
    });

    await newQuestion.save();

    res.status(201).json({ success: true, message: "Soru gönderildi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Soru gönderilemedi.", error });
  }
});

// === ADMIN TÜM SORULARI GÖRÜR ===
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const questions = await ProductQuestion.find()
      .populate("user", "firstName lastName email")
      .populate("product", "name");

    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sorular alınamadı.", error });
  }
});

// === ADMIN SORUYU CEVAPLAYARAK GÜNCELLER ===
router.put("/:id/answer", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await ProductQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Soru bulunamadı." });
    }

    question.answer = answer;
    question.answeredAt = Date.now();

    await question.save();

    res.status(200).json({ success: true, message: "Soru cevaplandı." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cevap eklenemedi.", error });
  }
});

export default router;
