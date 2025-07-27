"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sendEmail;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// .env dosyasının tam yolunu belirt (kendi proje yapına göre değiştir)
_dotenv.default.config({
  path: _path.default.resolve("./env/.dev") // Örneğin projenin kökünde env/.dev varsa
});

// Nodemailer transporter oluştur
const transporter = _nodemailer.default.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    // Gmail adresi
    pass: process.env.EMAIL_PASS // Gmail uygulama şifresi veya normal şifre (2FA varsa uygulama şifresi kullan)
  }
});

// Başarılı mail gönderiminde bildirim fonksiyonu (isteğe bağlı)
async function notifySuccess(info) {
  // Burada loglama, başka API çağrısı veya bildirim mekanizması olabilir
  console.log("✅ Mail başarıyla gönderildi. Response:", info.response);
}

// Hata durumunda bildirim fonksiyonu (isteğe bağlı)
async function notifyFailure(error) {
  // Hata loglama veya admin bildirimi vb. yapılabilir
  console.error("❌ Mail gönderiminde hata:", error.message);
}
async function sendEmail({
  to,
  subject,
  text,
  html
}) {
  const mailOptions = {
    from: `"Tercihsepetim" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    await notifySuccess(info);
    return info;
  } catch (error) {
    await notifyFailure(error);
    throw error;
  }
}