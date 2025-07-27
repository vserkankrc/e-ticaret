"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = refundPayment;
var _iyzipay = _interopRequireDefault(require("./iyzipay.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function refundPayment({
  paymentTransactionId,
  price,
  ip = "85.34.78.112"
}) {
  return new Promise((resolve, reject) => {
    const request = {
      locale: "tr",
      conversationId: `refund-${Date.now()}`,
      paymentTransactionId,
      price: price.toString(),
      currency: "TRY",
      ip
      // İstersen refund nedeni ekleyebilirsin, örneğin:
      // reason: "buyer_request"
    };
    _iyzipay.default.refund.create(request, (err, result) => {
      if (err) return reject(err);

      // Eğer result string ise parse et, değilse direkt kullan
      const response = typeof result === "string" ? JSON.parse(result) : result;
      console.log("İyzico iade cevabı:", response);
      if (response.status === "success") {
        resolve(response);
      } else {
        reject(new Error(response.errorMessage || "İade başarısız"));
      }
    });
  });
}