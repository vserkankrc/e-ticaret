"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
var _Coupon = _interopRequireDefault(require("../models/Coupon.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

// Yeni bir kupon oluşturma
router.post("/", async (req, res, next) => {
  try {
    const {
      code,
      discount,
      expirationDate
    } = req.body;

    // Yeni kupon oluştur
    const newCoupon = new _Coupon.default({
      code,
      discount,
      expirationDate
    });

    // Kuponu veritabanına kaydet
    await newCoupon.save();

    // Başarılı yanıt
    return res.status(201).json({
      message: "Kupon başarıyla oluşturuldu.",
      coupon: newCoupon
    });
  } catch (error) {
    return next(_ApiError.default.internal("Kupon oluşturulurken bir hata oluştu."));
  }
});

// Tüm kuponları listeleme
router.get("/", async (req, res, next) => {
  try {
    // Veritabanından tüm kuponları al
    const coupons = await _Coupon.default.find();

    // Kuponlar başarıyla alındı
    return res.status(200).json({
      message: "Kuponlar başarıyla alındı.",
      coupons
    });
  } catch (error) {
    return next(new _ApiError.default("Kuponlar alınırken bir hata oluştu.", 500, "INTERNAL_ERROR"));
  }
});

// Kupon güncelleme
router.put("/:id", async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const {
      code,
      discount,
      expirationDate
    } = req.body;

    // Kuponu bul
    const coupon = await _Coupon.default.findById(id);
    if (!coupon) {
      return next(_ApiError.default.notFound("Kupon bulunamadı."));
    }

    // Alanları güncelle
    if (code) coupon.code = code;
    if (discount) coupon.discount = discount;
    if (expirationDate) coupon.expirationDate = expirationDate;

    // Güncellenmiş kuponu kaydet
    await coupon.save();
    return res.status(200).json({
      message: "Kupon başarıyla güncellendi.",
      coupon
    });
  } catch (error) {
    return next(_ApiError.default.internal("Kupon güncellenirken bir hata oluştu."));
  }
});

// Kupon silme
router.delete("/:couponsId", async (req, res, next) => {
  try {
    const {
      couponsId
    } = req.params; // Parametre adını doğru kullan

    // Kuponu bul ve sil
    const coupon = await _Coupon.default.findByIdAndDelete(couponsId);
    if (!coupon) {
      return next(_ApiError.default.notFound("Kupon bulunamadı."));
    }
    return res.status(200).json({
      message: "Kupon başarıyla silindi."
    });
  } catch (error) {
    return next(_ApiError.default.internal("Kupon silinirken bir hata oluştu."));
  }
});
var _default = exports.default = router;