import express from 'express';
import jwt from 'jsonwebtoken';
import Users from "../models/Users.js";
import ApiError from '../error/ApiError.js';
import sendEmail from '../services/Email/passwordResetEmail.js';
import bcrypt from "bcryptjs";

const router = express.Router();

// Şifre sıfırlama isteği
router.post('/password', async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) return next(ApiError.NotFound('Kullanıcı bulunamadı'));

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${token}`;
        const html = `
          <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>
        `;

        await sendEmail({
            to: email,
            subject: "Şifre Sıfırlama Bağlantısı",
            html
        });

        res.status(200).json({ message: 'Şifre sıfırlama bağlantısı e-posta ile gönderildi' });
    } catch (error) {
        console.error(error);
        next(ApiError.InternalServerError());
    }
});


/**
 * 🔑 Yeni şifre kaydetme işlemi — Kullanıcı formdan yeni şifre gönderir
 */
router.post("/reset-password", async (req, res, next) => {
  const { token, password } = req.body;

  try {
    // Token geçerli mi kontrol et
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user)
      return next(ApiError.BadRequest("Token geçersiz veya süresi dolmuş"));

    // Şifreyi hashle
    user.password = await bcrypt.hash(password, 10);

    // Token'ı temizle
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Şifre başarıyla sıfırlandı" });
  } catch (error) {
    console.error("Şifre sıfırlama işlemi hatası:", error);
    next(ApiError.InternalServerError("Şifre sıfırlama başarısız oldu"));
  }
});


export default router;