import "./Policy.css"

const Policy = () => {
  return (
    <section className="policy">
    <div className="container">
      <ul className="policy-list">
        <li className="policy-item">
          <i className="bi bi-truck"></i>
          <div className="policy-texts">
            <strong>GÜVENİLİR KARGO</strong>
            <span></span>
          </div>
        </li>
        <li className="policy-item">
          <i className="bi bi-headset"></i>
          <div className="policy-texts">
            <strong>7/24 YARDIM DESTEĞİ</strong>
            <span></span>
          </div>
        </li>
        <li className="policy-item">
          <i className="bi bi-arrow-clockwise"></i>
          <div className="policy-texts">
            <strong> iADE VE DEĞİŞİM</strong>
            <span></span>
          </div>
        </li>
        <li className="policy-item">
          <i className="bi bi-credit-card"></i>
          <div className="policy-texts">
            <strong> GÜVENİLİR ÖDEME</strong>
            <span></span>
          </div>
        </li>
      </ul>
    </div>
  </section>
  )
}

export default Policy