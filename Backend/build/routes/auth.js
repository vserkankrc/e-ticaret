"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _Users = _interopRequireDefault(require("../models/Users.js"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

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
    const hashedPassword = await _bcrypt.default.hash(password, 10);
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
      email: newUser.email
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000
    }).status(201).json({
      token: `Bearer ${token}`,
      user: {
        id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber
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
      throw new _ApiError.default("E-mail veya şifre hatalı", 401, "E-mail veya şifre hatalı");
    }
    const isValidPassword = await _bcrypt.default.compare(password, user.password);
    if (!isValidPassword) {
      throw new _ApiError.default("E-mail veya şifre hatalı", 401, "E-mail veya şifre hatalı");
    }
    const userJson = user.toJSON();
    const token = _jsonwebtoken.default.sign(userJson, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000 // 1 saat
    }).status(200).json({
      user: {
        _id: userJson._id,
        email: userJson.email,
        role: userJson.role
      }
    });
  } catch (error) {
    console.log(error);
    if (error instanceof _ApiError.default) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }
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
    sameSite: "strict"
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

    // Cookie'den direkt token alıyoruz, Bearer yok
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
    const isMatch = await _bcrypt.default.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(_ApiError.default.BadRequest("Mevcut şifre hatalı."));
    }
    const hashedPassword = await _bcrypt.default.hash(newPassword, 10);
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
      // Yeni OAuth kullanıcısı oluştur
      user = new _Users.default({
        name,
        surname,
        email,
        isOAuthUser: true // Google ile oluşturulduğunu işaretle
      });
      await user.save();
    } else {
      // Mevcut kullanıcı var, Google OAuth kullanan biri ise ekstra kontroller yapabilirsin
      // Örneğin, isOAuthUser değilse klasik kullanıcıdır, dilersen özel işlem yapabilirsin
    }

    // Token üret
    const token = _jsonwebtoken.default.sign({
      _id: user._id,
      email: user.email
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // Token'ı cookie'ye koy, response dön
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000
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