"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Ortam dosyasını dinamik olarak belirle (NODE_ENV değişkenine göre)
const activeEnv = process.env.NODE_ENV === "production" ? "env/.prod" : "env/.dev";
_dotenv.default.config({
  path: _path.default.resolve(activeEnv)
});

// Kontrol amaçlı log (dilersen silebilirsin)
console.log("EMAIL_USER:", process.env.EMAIL_USER || "Tanımlı değil");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "şifre var" : "şifre yok");
const transporter = _nodemailer.default.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Bağlantı testi
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Transporter doğrulama hatası:", error);
  } else {
    console.log("✅ Transporter bağlantısı başarılı!");
  }
});

// Asenkron mail gönderme fonksiyonu
const sendEmail = async ({
  to,
  subject,
  html
}) => {
  const mailOptions = {
    from: `"Tercihsepetim" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail gönderildi:", info.response);
  } catch (error) {
    console.error("❌ Mail gönderilemedi:", error);
  }
};
var _default = exports.default = sendEmail;