import iyzipay from "../connection/iyzipay.js";
import logger from "../../../utils/logs.js";

/**
 * İyzico ile ödeme oluşturur
 * @param {Object} paymentData - Ödeme datası
 * @returns {Promise<Object>} - İyzico'dan gelen yanıt
 */


const createPayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    iyzipay.payment.create(paymentData, (err, result) => {
      if (err) {
        logger.error({
          type: "payment-fail",
          message: "İyzico ödeme API hatası",
          errorMessage: err.message,
          errorStack: err.stack,
          request: paymentData,
        });
        return reject(err);
      }

      let parsed;
      try {
        parsed = typeof result === "string" ? JSON.parse(result) : result;
      } catch (parseErr) {
        logger.error({
          type: "payment-parse-error",
          message: "İyzico yanıtı parse edilemedi",
          errorMessage: parseErr.message,
          response: result,
        });
        return reject(parseErr);
      }

      if (parsed.status === "success") {
        logger.info({
          type: "payment-success",
          message: "Ödeme başarıyla gerçekleşti",
          userEmail: paymentData?.buyer?.email,
          paymentId: parsed.paymentId,
          price: paymentData?.paidPrice,
        });
        return resolve(parsed);
      } else {
        logger.warn({
          type: "payment-declined",
          message: "İyzico ödemesi reddedildi",
          errorMessage: parsed.errorMessage,
          errorCode: parsed.errorCode,
          userEmail: paymentData?.buyer?.email,
        });
        return reject(parsed);
      }
    });
  });
};

export default createPayment;
