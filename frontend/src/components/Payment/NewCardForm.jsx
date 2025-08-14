// components/Checkout/NewCardForm.jsx
import PropTypes from "prop-types";

const NewCardForm = ({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvc,
  setCvc,
  saveCard,
  setSaveCard,
  setIsFlipped,
}) => {
  // Kart numarasını 4'erli gruplara ayırır, sadece rakamlar kabul edilir
  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  // Expiry Date için otomatik "/" ekler, sadece rakam kabul eder, max 5 karakter (AA/YY)
  const formatExpiryDate = (value) => {
    const clean = value.replace(/\D/g, "").slice(0, 4); // sadece rakam, max 4
    if (clean.length === 0) return "";
    if (clean.length <= 2) return clean;
    return clean.slice(0, 2) + "/" + clean.slice(2);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  return (
    <>
      <label>Kart Üzerindeki İsim</label>
      <input
        type="text"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        required
        placeholder="Ad Soyad"
      />

      <label>Kart Numarası</label>
      <input
        type="text"
        maxLength={19}
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        required
        placeholder="1234 5678 9012 3456"
        inputMode="numeric"
      />

      <label>Son Kullanma Tarihi (AA/YY)</label>
      <input
        type="text"
        maxLength={5}
        value={expiryDate}
        onChange={handleExpiryChange}
        required
        placeholder="MM/YY"
        inputMode="numeric"
      />

      <label>CVC</label>
      <input
        type="text"
        maxLength={4}
        value={cvc}
        onFocus={() => setIsFlipped(true)}
        onBlur={() => setIsFlipped(false)}
        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
        required
        placeholder="123"
        inputMode="numeric"
      />

      <div className="save-card-checkbox" style={{ margin: "12px 0" }}>
        <input
          type="checkbox"
          id="saveCard"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
        />
        <label htmlFor="saveCard">Kartımı Kaydet</label>
      </div>
    </>
  );
};

NewCardForm.propTypes = {
  cardName: PropTypes.string.isRequired,
  setCardName: PropTypes.func.isRequired,
  cardNumber: PropTypes.string.isRequired,
  setCardNumber: PropTypes.func.isRequired,
  expiryDate: PropTypes.string.isRequired,
  setExpiryDate: PropTypes.func.isRequired,
  cvc: PropTypes.string.isRequired,
  setCvc: PropTypes.func.isRequired,
  saveCard: PropTypes.bool.isRequired,
  setSaveCard: PropTypes.func.isRequired,
  setIsFlipped: PropTypes.func.isRequired,
};

export default NewCardForm;
