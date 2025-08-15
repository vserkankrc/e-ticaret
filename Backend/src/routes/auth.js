import express from "express";
import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import ApiError from "../error/ApiError.js";
import jwt from "jsonwebtoken";


const router = express.Router();

// Kullanıcı Oluşturma (Register)
router.post("/register", async (req, res, next) => {
  try {
    const { name, surname, email, password, phoneNumber } = req.body;

    if (!name || !surname || !email || !password || !phoneNumber) {
      return next(ApiError.badRequest("Tüm alanlar zorunludur."));
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return next(ApiError.badRequest("Bu e-posta zaten kullanılıyor."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name,
      surname,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();

    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain: "tercihsepetim.com",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      })
      .status(201)
      .json({
        token: `Bearer ${token}`,
        user: {
          id: newUser._id,
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
        },
      });
  } catch (error) {
    console.error(error);
    return next(ApiError.internal("Sunucu hatası."));
  }
});


// Kullanıcı Girişi (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      throw new ApiError(
        "E-mail veya şifre hatalı",
        401,
        "E-mail veya şifre hatalı"
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(
        "E-mail veya şifre hatalı",
        401,
        "E-mail veya şifre hatalı"
      );
    }

    const userJson = user.toJSON();
    const token = jwt.sign(userJson, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        domain: '.tercihsepetim.com',
        path: "/",
        maxAge: 60 * 60 * 1000, // 1 saat
      })
      .status(200)
      .json({
        user: { _id: userJson._id, email: userJson.email, role: userJson.role },
      });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

// Token doğrulaması yapacak check endpoint
router.get("/check", async (req, res) => {
  try {
    // Önbelleği engelle
    res.set("Cache-Control", "no-store");

    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ authenticated: false });
    }

    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded._id ile kullanıcıyı bul
    const user = await Users.findById(decoded._id);
    if (!user) {
      return res.status(200).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("checkAuth error:", error.message);
    return res.status(200).json({ authenticated: false });
  }
});

// Kullanıcı Çıkışı (Logout)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        domain: '.tercihsepetim.com',
        path: "/",
  
  });
  res.status(200).json({ message: "Çıkış başarılı." });
});

// 🔐 Şifre Değiştirme (Kullanıcı giriş yaptıktan sonra)
router.put("/change-password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const token = req.cookies.token;
    if (!token) {
      return next(ApiError.Unauthorized("Yetkisiz işlem. Giriş yapmalısınız."));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(
        ApiError.Unauthorized("Geçersiz token. Lütfen tekrar giriş yapın.")
      );
    }

    const user = await Users.findById(decoded._id);
    if (!user) {
      return next(ApiError.NotFound("Kullanıcı bulunamadı."));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(ApiError.BadRequest("Mevcut şifre hatalı."));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Şifreniz başarıyla değiştirildi." });
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    return next(
      ApiError.InternalServerError(
        "Şifre değiştirme işlemi sırasında bir hata oluştu."
      )
    );
  }
});

// Google ile Giriş (OAuth)
router.post("/google", async (req, res, next) => {
  try {
    const { email, name, surname } = req.body;

    if (!email) {
      return next(ApiError.badRequest("E-posta zorunludur."));
    }

    let user = await Users.findOne({ email });

    if (!user) {
      user = new Users({
        name,
        surname,
        email,
        isOAuthUser: true,
      });

      await user.save();
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain: "tercihsepetim.com",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      })
      .status(200)
      .json({
        token: `Bearer ${token}`,
        user: {
          id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          phoneNumber: user.phoneNumber || "",
          isOAuthUser: user.isOAuthUser || false,
        },
      });
  } catch (error) {
    console.error("Google login error:", error);
    return next(ApiError.internal("Google ile giriş yapılamadı."));
  }
});

export default router;
