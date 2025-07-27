"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _Users = _interopRequireDefault(require("../models/Users.js"));
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
var _auth = _interopRequireDefault(require("../middlewares/auth.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

// ✅ Tüm kullanıcıları getir (Sadece admin kullanımı için uygundur)
router.get("/", async (req, res) => {
  try {
    const users = await _Users.default.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json(_ApiError.default.internal("Sunucu hatası."));
  }
});

// ✅ E-posta ile kullanıcı sil
router.delete("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const deletedUser = await _Users.default.findOneAndDelete({
      email
    });
    if (!deletedUser) {
      return res.status(404).json(_ApiError.default.notFound("Kullanıcı bulunamadı."));
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json(_ApiError.default.internal("Sunucu hatası."));
  }
});

// ✅ Giriş yapmış kullanıcının profilini getir
router.get("/profile", _auth.default, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json(_ApiError.default.unauthorized("Yetkisiz erişim."));
    }
    const user = await _Users.default.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json(_ApiError.default.notFound("Kullanıcı bulunamadı."));
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(_ApiError.default.internal("Sunucu hatası."));
  }
});

// ✅ Giriş yapmış kullanıcının profil bilgilerini güncelle
router.put("/profile", _auth.default, async (req, res) => {
  try {
    const userId = req.user._id;
    const ip = req.headers["x-forwarded-for"]?.split(",").shift() || req.socket?.remoteAddress || null;
    const {
      billingType,
      name,
      surname,
      email,
      gender,
      phoneNumber,
      tcIdentityNumber,
      companyName,
      taxNumber,
      taxOffice,
      addresses,
      personalAddress: personalAddrFromBody,
      billingAddress: billingAddrFromBody,
      shippingAddress: shippingAddrFromBody,
      password // varsa
    } = req.body;
    const currentUser = await _Users.default.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı."
      });
    }

    // Google ile giriş yapan kullanıcılar bazı alanları değiştiremez
    if (currentUser.isOAuthUser) {
      if (email && email !== currentUser.email) {
        return res.status(400).json({
          message: "Google ile giriş yapan kullanıcılar e-posta adresini değiştiremez."
        });
      }
      if (password) {
        return res.status(400).json({
          message: "Google kullanıcıları şifre belirleyemez."
        });
      }
    }

    // Adresleri düzenle
    let personalAddress = currentUser.personalAddress || null;
    let billingAddress = currentUser.billingAddress || null;
    let shippingAddress = currentUser.shippingAddress || null;
    if (Array.isArray(addresses)) {
      for (const addr of addresses) {
        const label = addr?.label?.toLowerCase();
        if (!label) continue;
        if (label === "ev") personalAddress = addr;else if (label === "iş" || label === "iş yeri" || label === "şirket") billingAddress = addr;else if (label === "diğer" || label === "depo") shippingAddress = addr;
      }
    }
    if (personalAddrFromBody) personalAddress = personalAddrFromBody;
    if (billingAddrFromBody) billingAddress = billingAddrFromBody;
    if (shippingAddrFromBody) shippingAddress = shippingAddrFromBody;

    // Validasyonlar
    if (billingType === "bireysel") {
      if (!personalAddress || !personalAddress.address || !personalAddress.province || !personalAddress.district || !personalAddress.postalCode) {
        return res.status(400).json({
          message: "Bireysel kullanıcılar için kişisel adres zorunludur."
        });
      }
    } else if (billingType === "kurumsal") {
      if (!billingAddress || !billingAddress.address || !billingAddress.province || !billingAddress.district || !billingAddress.postalCode) {
        return res.status(400).json({
          message: "Kurumsal kullanıcılar için fatura adresi zorunludur."
        });
      }
      if (!shippingAddress || !shippingAddress.address || !shippingAddress.province || !shippingAddress.district || !shippingAddress.postalCode) {
        return res.status(400).json({
          message: "Kurumsal kullanıcılar için sevk adresi zorunludur."
        });
      }
      if (!companyName || !taxNumber || !taxOffice) {
        return res.status(400).json({
          message: "Kurumsal kullanıcılar için şirket bilgileri eksik."
        });
      }
    }
    const newAddresses = [];
    if (personalAddress) newAddresses.push(personalAddress);
    if (billingAddress) newAddresses.push(billingAddress);
    if (shippingAddress) newAddresses.push(shippingAddress);
    const updateData = {
      billingType,
      name,
      surname,
      gender,
      phoneNumber,
      tcIdentityNumber,
      personalAddress,
      billingAddress,
      shippingAddress,
      addresses: newAddresses,
      companyName,
      taxNumber,
      taxOffice
    };
    if (!currentUser.isOAuthUser && email) {
      updateData.email = email;
    }
    if (ip) updateData.ip = ip;
    const updatedUser = await _Users.default.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });
    return res.json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    console.error("Profil güncelleme hatası:", err.message);
    return res.status(500).json({
      message: "Profil güncellenirken hata oluştu."
    });
  }
});
var _default = exports.default = router;