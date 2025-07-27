"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPayment = void 0;
var _iyzipay = _interopRequireDefault(require("../connection/iyzipay.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// src/services/iyzico/payment/createPayment.js

const createPayment = paymentData => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.payment.create(paymentData, (err, result) => {
      if (err) {
        return reject(err);
      }
      if (result.status === "failure") {
        return reject(result);
      }
      resolve(result);
    });
  });
};
exports.createPayment = createPayment;