"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _Users = _interopRequireDefault(require("../models/Users.js"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
const isProd = process.env.NODE_ENV === "production"; // burayı importlardan sonra yaz
// Kullanıcı Oluşturma (Register)
router.post("/register", async (req, res, next) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      phoneNumber
    } = req.body;
    if (!name || !surname || !email || !password || !phoneNumber) {
      return next(_ApiError.default.badRequest("Tüm alanlar zorunludur."));
    }
    const existingUser = await _Users.default.findOne({
      email
    });
    if (existingUser) {
      return next(_ApiError.default.badRequest("Bu e-posta zaten kullanılıyor."));
    }
    const hashedPassword = await _bcryptjs.default.hash(password, 10);
    const newUser = new _Users.default({
      name,
      surname,
      email,
      password: hashedPassword,
      phoneNumber
    });
    await newUser.save();
    const token = _jsonwebtoken.default.sign({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      // prod için https
      sameSite: isProd ? "None" : "Lax",
      // cross-site destek
      domain: isProd ? ".tercihsepetim.com" : undefined,
      // localhost için domain yok
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 gün
    }).status(201).json({
      token: `Bearer ${token}`,
      user: {
        id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error(error);
    return next(_ApiError.default.internal("Sunucu hatası."));
  }
});

// Kullanıcı Girişi (Login)
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await _Users.default.findOne({
      email
    });
    if (!user) {
      return res.status(401).json({
        message: "E-mail veya şifre hatalı"
      });
    }
    const isValidPassword = await _bcryptjs.default.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "E-mail veya şifre hatalı"
      });
    }
    const token = _jsonwebtoken.default.sign({
      _id: user._id,
      email: user.email,
      role: user.role
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      domain: isProd ? ".tercihsepetim.com" : undefined,
      path: "/",
      maxAge: 1000 * 60 * 60 // 1 saat
    }).status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Sunucu hatası."
    });
  }
});

// Token doğrulaması yapacak check endpoint
router.get("/check", async (req, res) => {
  try {
    // Önbelleği engelle
    res.set("Cache-Control", "no-store");
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({
        authenticated: false
      });
    }

    // Token doğrulama
    const decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET);

    // decoded._id ile kullanıcıyı bul
    const user = await _Users.default.findById(decoded._id);
    if (!user) {
      return res.status(200).json({
        authenticated: false
      });
    }
    return res.status(200).json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("checkAuth error:", error.message);
    return res.status(200).json({
      authenticated: false
    });
  }
});

// Kullanıcı Çıkışı (Logout)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    domain: '.tercihsepetim.com',
    path: "/"
  });
  res.status(200).json({
    message: "Çıkış başarılı."
  });
});

// 🔐 Şifre Değiştirme (Kullanıcı giriş yaptıktan sonra)
router.put("/change-password", async (req, res, next) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return next(_ApiError.default.Unauthorized("Yetkisiz işlem. Giriş yapmalısınız."));
    }
    let decoded;
    try {
      decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(_ApiError.default.Unauthorized("Geçersiz token. Lütfen tekrar giriş yapın."));
    }
    const user = await _Users.default.findById(decoded._id);
    if (!user) {
      return next(_ApiError.default.NotFound("Kullanıcı bulunamadı."));
    }
    const isMatch = await _bcryptjs.default.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(_ApiError.default.BadRequest("Mevcut şifre hatalı."));
    }
    const hashedPassword = await _bcryptjs.default.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      message: "Şifreniz başarıyla değiştirildi."
    });
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    return next(_ApiError.default.InternalServerError("Şifre değiştirme işlemi sırasında bir hata oluştu."));
  }
});

// Google ile Giriş (OAuth)
router.post("/google", async (req, res, next) => {
  try {
    const {
      email,
      name,
      surname
    } = req.body;
    if (!email) {
      return next(_ApiError.default.badRequest("E-posta zorunludur."));
    }
    let user = await _Users.default.findOne({
      email
    });
    if (!user) {
      user = new _Users.default({
        name,
        surname,
        email,
        isOAuthUser: true
      });
      await user.save();
    }
    const token = _jsonwebtoken.default.sign({
      _id: user._id,
      email: user.email
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: "tercihsepetim.com",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/"
    }).status(200).json({
      token: `Bearer ${token}`,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        isOAuthUser: user.isOAuthUser || false
      }
    });
  } catch (error) {
    console.error("Google login error:", error);
    return next(_ApiError.default.internal("Google ile giriş yapılamadı."));
  }
});
var _default = exports.default = router;