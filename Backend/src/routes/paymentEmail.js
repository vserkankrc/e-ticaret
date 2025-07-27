import express from 'express';
import ApiError from '../error/ApiError.js';
import { sendPaymentSuccessEmail } from '../services/mail/paySendEmail.js';

const router = express.Router();

router.post('/payment-success', async (req, res, next) => {
  const { order } = req.body; // Ödeme sonrası backend’de oluşan sipariş detayları

  if (!order) return next(ApiError.BadRequest("Sipariş bilgisi eksik"));

  try {
    await sendPaymentSuccessEmail(order);
    res.status(200).json({ message: 'Ödeme sonrası mail gönderildi' });
  } catch (error) {
    console.error(error);
    next(ApiError.InternalServerError());
  }
});

export default router;
