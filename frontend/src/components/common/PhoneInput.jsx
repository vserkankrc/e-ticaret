// src/components/common/PhoneInput.jsx
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
import { Input } from "antd";

const PhoneInput = ({
  value = "",
  onChange,
  placeholder = "+90 (___) ___ __ __",
  ...rest
}) => {
  return (
    <InputMask
      mask="+90 (999) 999 99 99"
      value={value}
      onChange={onChange}
      maskChar={null}
    >
      {(inputProps) => (
        <Input
          {...inputProps}
          {...rest}
          placeholder={placeholder}
          type="tel"
        />
      )}
    </InputMask>
  );
};

PhoneInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

// defaultProps artık kullanılmıyor

export default PhoneInput;
