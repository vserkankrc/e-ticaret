import iyzipay from "./iyzipay.js";

export default function refundPayment({ paymentTransactionId, price, ip = "85.34.78.112" }) {
  return new Promise((resolve, reject) => {
    const request = {
      locale: "tr",
      conversationId: `refund-${Date.now()}`,
      paymentTransactionId,
      price: price.toString(),
      currency: "TRY",
      ip,
      // İstersen refund nedeni ekleyebilirsin, örneğin:
      // reason: "buyer_request"
    };

    iyzipay.refund.create(request, (err, result) => {
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
