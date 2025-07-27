import PropTypes from "prop-types";

const AgreementSection = ({ accepted, setAccepted }) => (
  <div className="contract-checkbox" style={{ marginTop: "10px" }}>
    <input
      type="checkbox"
      id="contract"
      checked={accepted}
      onChange={(e) => setAccepted(e.target.checked)}
      required
    />
    <label htmlFor="contract" style={{ marginLeft: "8px", cursor: "pointer" }}>
      Satış sözleşmesini okudum ve kabul ediyorum.
    </label>
    <br />
    <p style={{ fontSize: "12px", color: "#555", marginTop: "6px", maxWidth: "400px" }}>
      Satın alınan ürünlere ilişkin teslimat, iade ve garanti koşulları bu sözleşme kapsamında geçerlidir.
      Sipariş vermenizle birlikte bu koşulları kabul etmiş sayılırsınız.
    </p>
  </div>
);

AgreementSection.propTypes = {
  accepted: PropTypes.bool.isRequired,
  setAccepted: PropTypes.func.isRequired,
};

export default AgreementSection;
