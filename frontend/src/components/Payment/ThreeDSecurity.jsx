import PropTypes from "prop-types";

const ThreeDSecurity = ({ use3DSecure, setUse3DSecure }) => {
  return (
    <div className="payment-type-selection">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={use3DSecure}
          onChange={() => setUse3DSecure(!use3DSecure)}
        />
        <span>3D Güvenli Ödeme Kullan</span>
      </label>
    </div>
  );
};

ThreeDSecurity.propTypes = {
  use3DSecure: PropTypes.bool.isRequired,
  setUse3DSecure: PropTypes.func.isRequired,
};

export default ThreeDSecurity;
