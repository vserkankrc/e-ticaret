"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));
var _paySendEmail = require("../services/mail/paySendEmail.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.post('/payment-success', async (req, res, next) => {
  const {
    order
  } = req.body; // Ödeme sonrası backend’de oluşan sipariş detayları

  if (!order) return next(_ApiError.default.BadRequest("Sipariş bilgisi eksik"));
  try {
    await (0, _paySendEmail.sendPaymentSuccessEmail)(order);
    res.status(200).json({
      message: 'Ödeme sonrası mail gönderildi'
    });
  } catch (error) {
    console.error(error);
    next(_ApiError.default.InternalServerError());
  }
});
var _default = exports.default = router;