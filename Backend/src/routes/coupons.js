import express from "express";
import ApiError from "../error/ApiError.js";
import Coupon from "../models/Coupon.js";

const router = express.Router();

// Yeni bir kupon oluşturma
router.post("/", async (req, res, next) => {
  try {
    const { code, discount, expirationDate } = req.body;

    // Yeni kupon oluştur
    const newCoupon = new Coupon({
      code,
      discount,
      expirationDate,
    });

    // Kuponu veritabanına kaydet
    await newCoupon.save();

    // Başarılı yanıt
    return res
      .status(201)
      .json({ message: "Kupon başarıyla oluşturuldu.", coupon: newCoupon });
  } catch (error) {
    return next(ApiError.internal("Kupon oluşturulurken bir hata oluştu."));
  }
});

// Tüm kuponları listeleme
router.get("/", async (req, res, next) => {
    try {
        // Veritabanından tüm kuponları al
        const coupons = await Coupon.find();

        // Kuponlar başarıyla alındı
        return res.status(200).json({
            message: "Kuponlar başarıyla alındı.",
            coupons,
        });
    } catch (error) {
        return next(new ApiError("Kuponlar alınırken bir hata oluştu.", 500, "INTERNAL_ERROR"));
    }
});

// Kupon güncelleme
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate } = req.body;

    // Kuponu bul
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return next(ApiError.notFound("Kupon bulunamadı."));
    }

    // Alanları güncelle
    if (code) coupon.code = code;
    if (discount) coupon.discount = discount;
    if (expirationDate) coupon.expirationDate = expirationDate;

    // Güncellenmiş kuponu kaydet
    await coupon.save();

    return res
      .status(200)
      .json({ message: "Kupon başarıyla güncellendi.", coupon });
  } catch (error) {
    return next(ApiError.internal("Kupon güncellenirken bir hata oluştu."));
  }
});

// Kupon silme
router.delete("/:couponsId", async (req, res, next) => {
    try {
        const { couponsId } = req.params; // Parametre adını doğru kullan

        // Kuponu bul ve sil
        const coupon = await Coupon.findByIdAndDelete(couponsId);
        if (!coupon) {
            return next(ApiError.notFound("Kupon bulunamadı."));
        }

        return res.status(200).json({ message: "Kupon başarıyla silindi." });
    } catch (error) {
        return next(ApiError.internal("Kupon silinirken bir hata oluştu."));
    }
});

export default router;
