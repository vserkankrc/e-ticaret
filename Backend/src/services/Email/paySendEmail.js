import sendEmail from "./sendEmail.js";

// Yeni ödeme başarılı şablonu
const paymentSuccessTemplate = (order) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px; border-radius: 8px; color: #333;">
    <h2 style="color: #4CAF50;">Ödemeniz Alındı 🎉</h2>
    <p>Merhaba <strong>${order.userName}</strong>,</p>
    <p>${order.orderDate || "Bugünkü"} siparişiniz başarıyla alındı ve ödemesi onaylandı.</p>

    <h3 style="margin-top: 20px;">📦 Sipariş Özeti</h3>
    <ul>
      ${order.items.map(item => `
        <li>
          ${item.title} - <strong>${item.quantity} adet</strong>
        </li>`).join("")}
    </ul>

    <p style="margin-top: 12px;">
      Toplam Tutar: <strong>${order.totalPrice} ${order.currency}</strong>
    </p>

    <p>En kısa sürede siparişiniz hazırlanıp kargoya verilecektir.</p>

    <hr style="margin: 24px 0;" />

    <p style="font-size: 14px; color: #777;">
      Bu e-posta, tercihsepetim.com üzerinden yapılan alışverişinize istinaden gönderilmiştir. Yardım veya destek için bizimle iletişime geçebilirsiniz.
    </p>

    <p style="font-size: 13px; color: #999;">Tercih Sepetim © ${new Date().getFullYear()}</p>
  </div>
`;

// E-posta gönderim fonksiyonu
export const sendPaymentSuccessEmail = async (order) => {
  await sendEmail({
    to: order.userEmail,
    subject: "Tercih Sepetim - Ödemeniz Başarıyla Alındı",
    html: paymentSuccessTemplate(order),
  });
};
