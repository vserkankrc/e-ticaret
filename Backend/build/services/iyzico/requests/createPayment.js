"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _iyzipay = _interopRequireDefault(require("../connection/iyzipay.js"));
var _logs = _interopRequireDefault(require("../../../utils/logs.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * İyzico ile ödeme oluşturur
 * @param {Object} paymentData - Ödeme datası
 * @returns {Promise<Object>} - İyzico'dan gelen yanıt
 */

const createPayment = paymentData => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.payment.create(paymentData, (err, result) => {
      if (err) {
        _logs.default.error({
          type: "payment-fail",
          message: "İyzico ödeme API hatası",
          errorMessage: err.message,
          errorStack: err.stack,
          request: paymentData
        });
        return reject(err);
      }
      let parsed;
      try {
        parsed = typeof result === "string" ? JSON.parse(result) : result;
      } catch (parseErr) {
        _logs.default.error({
          type: "payment-parse-error",
          message: "İyzico yanıtı parse edilemedi",
          errorMessage: parseErr.message,
          response: result
        });
        return reject(parseErr);
      }
      if (parsed.status === "success") {
        _logs.default.info({
          type: "payment-success",
          message: "Ödeme başarıyla gerçekleşti",
          userEmail: paymentData?.buyer?.email,
          paymentId: parsed.paymentId,
          price: paymentData?.paidPrice
        });
        return resolve(parsed);
      } else {
        _logs.default.warn({
          type: "payment-declined",
          message: "İyzico ödemesi reddedildi",
          errorMessage: parsed.errorMessage,
          errorCode: parsed.errorCode,
          userEmail: paymentData?.buyer?.email
        });
        return reject(parsed);
      }
    });
  });
};
var _default = exports.default = createPayment;