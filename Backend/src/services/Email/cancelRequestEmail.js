import sendEmail from "./sendEmail.js";

export async function sendCancelRequestEmail({ userName, userEmail, orderId }) {
  const subject = "Sipariş İptal Talebiniz Alındı";

  const text = `
    Merhaba ${userName},

    ${orderId} numaralı siparişiniz için iptal talebiniz başarıyla alınmıştır.
    Yetkili ekibimiz iade sürecinizi kısa süre içerisinde başlatacaktır.

    Talebinizin işlenmesi ortalama 1-3 iş günü sürebilir. İade tamamlandığında bilgilendirme yapılacaktır.

    Teşekkür ederiz.
    www.tercihsepetim.com
  `;

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:sans-serif;border:1px solid #ddd;border-radius:6px;padding:24px;">
      <div style="text-align:center;margin-bottom:20px;">
        <img src="http://localhost:443/assets/logo.png" alt="Tercih Sepetim" style="max-width:180px;height:auto;" />
      </div>
      <h2 style="color:#333;">Sipariş İptal Talebiniz Alındı</h2>
      <p>Merhaba <strong>${userName}</strong>,</p>
      <p>
        <strong>${orderId}</strong> numaralı siparişiniz için <strong>iptal talebiniz başarıyla alınmıştır.</strong>
      </p>
      <p>Yetkili ekibimiz kısa süre içerisinde iade sürecinizi başlatacaktır.</p>
      <p>
        Ortalama işlem süresi <strong>1-3 iş günü</strong> olup, işlemin tamamlanmasının ardından tarafınıza ayrıca bilgilendirme yapılacaktır.
      </p>
      <p style="margin-top:24px;">Herhangi bir sorunuz olursa <a href="mailto:destek@tercihsepetim.com">destek@tercihsepetim.com</a> adresinden bize ulaşabilirsiniz.</p>
      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;" />
      <p style="font-size:14px;color:#777;">Bu mail, www.tercihsepetim.com üzerinden gerçekleştirdiğiniz bir işlemle ilgilidir.</p>
    </div>
  `;

  return await sendEmail({ to: userEmail, subject, text, html });
}
