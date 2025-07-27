import "./Communication.css";

const Communication = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "905449840844"; // Your WhatsApp number in international format
    const message = "Merhaba! Size nasıl yardımcı olabilirim?"; // Initial message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank"); // Open in a new tab
  };
  return (
    <div className="Communication-policy">
      <div className="Communication-title">
        <h5>İletişim Bilgileri</h5>
      </div>

      <div className="Communication-content-all">
        <div className="Communication-content-left">
          <h4>Adres</h4>
          <p>
            Hamidiye Mahallesi Ulubat Hasan Caddesi Balcı Sokak No:8
            Çekmeköy/İstanbul
          </p>
          <br />
          <p>
            <b>Tel:</b> +90 544 984 08 44
          </p>
          <p>
            <b>Sarıgazi V.D:</b>
          </p>
          <p>
            <b>Ticaret Sicil No:</b> 111111111111
          </p>
          <p>
            <b>Kep Adresi:</b> veliserkan.karaca@hs01.kep.tr
          </p>
          <p>
            <b>Mersis Numarası:</b>
          </p>
          <p>
            <b>Sorumlu Kişi:</b>Veli Serkan Karaca
          </p>
        </div>
        <div className="Communication-content-right">
          <h4>Müşteri Hizmetleri</h4>
          <p>
            Çağrı Merkezimiz hafta içi ve hafta sonu 08.30 / 24.00 saatleri
            arasında hizmet vermektedir.
          </p>
          <br />
          <br />
          <br />
          <button onClick={handleWhatsAppClick}>CANLI YARDIM MERKEZİ</button>
        </div>
      </div>
    </div>
  );
};

export default Communication;
