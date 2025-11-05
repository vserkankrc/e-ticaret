// src/utils/sendPaymentSuccessEmail.js
import sendEmail from "./sendEmail.js";

const paymentSuccessTemplate = (order) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #4CAF50; text-align: center;">Ödemeniz Alındı 🎉</h2>
    <p>Merhaba <strong>${order.userName}</strong>,</p>
    <p>${order.orderDate || "Bugünkü"} siparişiniz başarıyla alındı ve ödemesi onaylandı.</p>

    <h3 style="margin-top: 20px;">📦 Sipariş Özeti</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px;">Ürün</th>
          <th style="text-align: center; padding: 8px;">Adet</th>
          <th style="text-align: right; padding: 8px;">Fiyat</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; display: flex; align-items: center;">
              <img src="${item.images && item.images[0] ? item.images[0] : ''}" alt="${item.name || 'Ürün'}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 4px;" />
              <span>${item.name || 'Ürün'}</span>
            </td>
            <td style="padding: 8px; text-align: center;">${item.quantity || 1}</td>
            <td style="padding: 8px; text-align: right;">${item.price ? `${item.price} ${order.currency}` : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <p style="margin-top: 12px; font-weight: bold; text-align: right;">
      Toplam Tutar: ${order.totalPrice} ${order.currency}
    </p>

    <p>En kısa sürede siparişiniz hazırlanıp kargoya verilecektir.</p>

    <hr style="margin: 24px 0;" />

    <p style="font-size: 14px; color: #777;">
      Bu e-posta, tercihsepetim.com üzerinden yapılan alışverişinize istinaden gönderilmiştir. Yardım veya destek için bizimle iletişime geçebilirsiniz.
    </p>

    <p style="font-size: 13px; color: #999; text-align: center;">Tercih Sepetim © ${new Date().getFullYear()}</p>
  </div>
`;

// E-posta gönderim fonksiyonu
export const sendPaymentSuccessEmail = async (order) => {
  try {
    await sendEmail({
      to: order.userEmail,
      subject: "Tercih Sepetim - Ödemeniz Başarıyla Alındı",
      html: paymentSuccessTemplate(order),
    });
    console.log("✅ Ödeme başarıyla e-posta olarak gönderildi.");
  } catch (err) {
    console.error("❌ E-posta gönderilirken hata oluştu:", err);
  }
};
