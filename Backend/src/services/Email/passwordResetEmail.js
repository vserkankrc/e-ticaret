import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Ortam dosyasını dinamik olarak belirle (NODE_ENV değişkenine göre)
const activeEnv = process.env.NODE_ENV === "production" ? "env/.prod" : "env/.dev";
dotenv.config({ path: path.resolve(activeEnv) });

// Kontrol amaçlı log (dilersen silebilirsin)
console.log("EMAIL_USER:", process.env.EMAIL_USER || "Tanımlı değil");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "şifre var" : "şifre yok");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Tercihsepetim" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail gönderildi:", info.response);
  } catch (error) {
    console.error("❌ Mail gönderilemedi:", error);
  }
};

export default sendEmail;
