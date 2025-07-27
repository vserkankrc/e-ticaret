import express from "express";
import Reviews from "../models/Reviews.js";   // model adı Reviews
import Product from "../models/Products.js";    // model adı Product
import Users from "../models/Users.js";        // model adı Users
import authMiddleware from "../middlewares/auth.js";
import isAdminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// 🟢 Kullanıcı: Ürüne yorum yap
router.post("/:productId", authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Ürün var mı kontrol et
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    // Aynı kullanıcı aynı ürün için daha önce yorum yapmış mı kontrol et
    const alreadyReviewed = await Reviews.findOne({ productId, userId: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Bu ürüne daha önce yorum yaptınız" });
    }

    // Yeni yorum oluştur
    const review = await Reviews.create({
      productId,
      userId: req.user._id,
      rating,
      comment,
      status: "pending",
    });

    res.status(201).json({ message: "Yorumunuz incelemeye alındı.", review });
  } catch (err) {
    next(err);
  }
});

// 🟡 Admin: Bekleyen yorumları getir
router.get("/pending", authMiddleware, isAdminMiddleware, async (req, res, next) => {
  try {
    const pendingReviews = await Reviews.find({ status: "pending" })
      .populate("productId", "name")
      .populate("userId", "name surname email");

    res.status(200).json(pendingReviews);
  } catch (err) {
    next(err);
  }
});

// 🟢 Admin: Yorumu onayla
router.put("/:reviewId/approve", authMiddleware, isAdminMiddleware, async (req, res, next) => {
  console.log("Approve route hit");
  console.log("req.params.reviewId:", req.params.reviewId);
  console.log("req.path:", req.path);

  try {
    const review = await Reviews.findByIdAndUpdate(
      req.params.reviewId,
      { status: "approved" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    res.status(200).json({ message: "Yorum onaylandı", review });
  } catch (err) {
    next(err);
  }
});



// 🔴 Admin: Yorumu reddet ve sil
router.delete("/reject/:reviewId", authMiddleware, isAdminMiddleware, async (req, res, next) => {
  try {
    const review = await Reviews.findByIdAndDelete(req.params.reviewId);

    if (!review) return res.status(404).json({ message: "Yorum bulunamadı" });
    res.status(200).json({ message: "Yorum reddedildi ve silindi" });
  } catch (err) {
    next(err);
  }
});

// 🟢 Kullanıcı: Kendi yorumlarını getir
router.get("/my-reviews", authMiddleware, async (req, res, next) => {
  try {
    const reviews = await Reviews.find({ userId: req.user._id })
      .populate("productId", "name");

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});


// ✅ Yorumları getir (kullanıcı isimleriyle birlikte)
router.get("/product/:productId", async (req, res, next) => {
  try {
    const reviews = await Reviews.find({ productId: req.params.productId })
      .populate("userId", "name surname"); // userId'den sadece name ve surname çek

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
});

// ✅ Ortalama rating hesapla
router.get("/product/:productId/rating", async (req, res, next) => {
  try {
    const reviews = await Reviews.find({ productId: req.params.productId });

    if (reviews.length === 0) {
      return res.json({ averageRating: 0, count: 0 });
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = total / reviews.length;

    res.json({ averageRating, count: reviews.length });
  } catch (err) {
    next(err);
  }
});


export default router;



