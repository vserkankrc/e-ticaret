"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _Users = _interopRequireDefault(require("../models/Users.js"));
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
var _passwordResetEmail = _interopRequireDefault(require("../services/Email/passwordResetEmail.js"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

// Şifre sıfırlama isteği
router.post('/password', async (req, res, next) => {
  const {
    email
  } = req.body;
  try {
    const user = await _Users.default.findOne({
      email
    });
    if (!user) return next(_ApiError.default.NotFound('Kullanıcı bulunamadı'));
    const token = _jsonwebtoken.default.sign({
      id: user._id
    }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const html = `
          <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>
        `;
    await (0, _passwordResetEmail.default)({
      to: email,
      subject: "Şifre Sıfırlama Bağlantısı",
      html
    });
    res.status(200).json({
      message: 'Şifre sıfırlama bağlantısı e-posta ile gönderildi'
    });
  } catch (error) {
    console.error(error);
    next(_ApiError.default.InternalServerError());
  }
});

/**
 * 🔑 Yeni şifre kaydetme işlemi — Kullanıcı formdan yeni şifre gönderir
 */
router.post("/reset-password", async (req, res, next) => {
  const {
    token,
    password
  } = req.body;
  try {
    // Token geçerli mi kontrol et
    const decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
    const user = await _Users.default.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    });
    if (!user) return next(_ApiError.default.BadRequest("Token geçersiz veya süresi dolmuş"));

    // Şifreyi hashle
    user.password = await _bcryptjs.default.hash(password, 10);

    // Token'ı temizle
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.status(200).json({
      message: "Şifre başarıyla sıfırlandı"
    });
  } catch (error) {
    console.error("Şifre sıfırlama işlemi hatası:", error);
    next(_ApiError.default.InternalServerError("Şifre sıfırlama başarısız oldu"));
  }
});
var _default = exports.default = router;