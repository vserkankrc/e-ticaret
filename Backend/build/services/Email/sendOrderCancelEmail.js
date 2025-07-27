"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendOrderCancelEmail = sendOrderCancelEmail;
var _sendEmail = _interopRequireDefault(require("./sendEmail.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
async function sendOrderCancelEmail({
  userName,
  userEmail,
  orderId,
  totalAmount
}) {
  const subject = "Sipariş İptal ve İade Bilgilendirmesi";
  const text = `
    Merhaba ${userName},

    ${orderId} numaralı siparişiniz başarıyla iptal edilmiştir.
    İade tutarınız ₺${totalAmount} olarak işleme alınmıştır.

    Anlayışınız için teşekkür eder, iyi günler dileriz.
    www.tercihsepetim.com
  `;
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:sans-serif;border:1px solid #ddd;border-radius:6px;padding:24px;">
      <div style="text-align:center;margin-bottom:20px;">
        <img src="http://localhost:443/assets/logo.png" alt="Tercih Sepetim" style="max-width:180px;height:auto;" />
      </div>
      <h2 style="color:#333;">Sipariş İptal ve İade Bilgilendirmesi</h2>
      <p>Merhaba <strong>${userName}</strong>,</p>
      <p>
        <strong>${orderId}</strong> numaralı siparişiniz <span style="color:#e53935;">iptal edilmiştir</span>.
      </p>
      <p>
        İade tutarınız: <strong style="color:#2e7d32;">₺${totalAmount}</strong> olarak en kısa sürede hesabınıza yansıtılacaktır.
      </p>
      <p style="margin-top:24px;">Herhangi bir sorunuz olursa <a href="mailto:destek@tercihsepetim.com">destek@tercihsepetim.com</a> adresinden bizimle iletişime geçebilirsiniz.</p>
      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;" />
      <p style="font-size:14px;color:#777;">Bu mail, www.tercihsepetim.com üzerinden gerçekleştirdiğiniz işlemle ilgilidir.</p>
    </div>
  `;
  return await (0, _sendEmail.default)({
    to: userEmail,
    subject,
    text,
    html
  });
}