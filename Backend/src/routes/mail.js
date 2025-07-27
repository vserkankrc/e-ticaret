import express from "express";
import sendEmail from "../services/Email/sendEmail.js";
const router = express.Router();

router.post("/send-confirmation", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail({ to, subject, text, html });
    res.status(200).json({ success: true, message: "Mail gönderildi" });
  } catch (error) {
    console.error("Mail gönderilemedi:", error);
    res.status(500).json({ success: false, message: "Mail gönderilemedi" });
  }
});

export default router;
