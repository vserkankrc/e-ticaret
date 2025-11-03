import express from "express";
import ApiError from "../error/ApiError.js";
import Coupon from "../models/Coupon.js";

const router = express.Router();

// Yeni bir kupon oluşturma
router.post("/", async (req, res, next) => {
  try {
    const { code, discount, expirationDate } = req.body;

    const newCoupon = new Coupon({
      code,
      discount,
      expirationDate,
    });

    await newCoupon.save();

    return res
      .status(201)
      .json({ message: "Kupon başarıyla oluşturuldu.", coupon: newCoupon });
  } catch (error) {
    return next(ApiError.InternalServerError("Kupon oluşturulurken bir hata oluştu."));
  }
});

// Tüm kuponları listeleme
router.get("/", async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json({
      message: "Kuponlar başarıyla alındı.",
      coupons,
    });
  } catch (error) {
    return next(ApiError.InternalServerError("Kuponlar alınırken bir hata oluştu."));
  }
});

// Kupon doğrulama
router.post("/validate", async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return next(ApiError.BadRequest("Kupon kodu girilmedi."));

    const coupon = await Coupon.findOne({ code });

    if (!coupon) return next(ApiError.NotFound("Kupon bulunamadı."));

    const now = new Date();
    if (new Date(coupon.expirationDate) < now) {
      return next(ApiError.BadRequest("Kupon süresi dolmuştur. Yeni kupon için iletişime geçin."));
    }

    // Kupon geçerli
    res.status(200).json({
      discount: coupon.discount,
      code: coupon.code,
    });
  } catch (err) {
    next(ApiError.InternalServerError("Kupon doğrulama sırasında hata oluştu."));
  }
});

// Kupon güncelleme
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return next(ApiError.NotFound("Kupon bulunamadı."));
    }

    if (code) coupon.code = code;
    if (discount) coupon.discount = discount;
    if (expirationDate) coupon.expirationDate = expirationDate;

    await coupon.save();

    return res
      .status(200)
      .json({ message: "Kupon başarıyla güncellendi.", coupon });
  } catch (error) {
    return next(ApiError.InternalServerError("Kupon güncellenirken bir hata oluştu."));
  }
});

// Kupon silme
router.delete("/:couponsId", async (req, res, next) => {
  try {
    const { couponsId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponsId);
    if (!coupon) {
      return next(ApiError.NotFound("Kupon bulunamadı."));
    }

    return res.status(200).json({ message: "Kupon başarıyla silindi." });
  } catch (error) {
    return next(ApiError.InternalServerError("Kupon silinirken bir hata oluştu."));
  }
});

export default router;
