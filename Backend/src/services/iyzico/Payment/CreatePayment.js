// src/services/iyzico/payment/createPayment.js
import iyzipay from "../connection/iyzipay.js";

export const createPayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    iyzipay.payment.create(paymentData, (err, result) => {
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
