import PropTypes from "prop-types";
import AddressFields from "./AddressFields";
import { Radio, Input, Button, Spin, Alert } from "antd";
import PhoneInput from "../../../components/common/PhoneInput.jsx"; // Path'ini kendi yapına göre ayarla
import { Select } from "antd";
const { Option } = Select;

const BillingForm = ({
  data,
  errors,
  loading,
  onChange,
  onBillingTypeChange,
  billingType,
  handleSubmit,
}) => {
  const handleInputChange = (e) => {
    onChange(e.target.name, e.target.value);
  };
  const handleSelectChange = (name, value) => {
    onChange(name, value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Fatura Tipi</h2>
      <Radio.Group
        onChange={(e) => onBillingTypeChange(e.target.value)}
        value={billingType}
        style={{ marginBottom: "1rem" }}
      >
        <Radio value="bireysel">Bireysel</Radio>
        <Radio value="kurumsal">Kurumsal</Radio>
      </Radio.Group>

      {billingType === "bireysel" ? (
        <>
          <Input
            name="email"
            placeholder="E-posta"
            value={data.email}
            onChange={handleInputChange}
            status={errors.email ? "error" : ""}
            readOnly
            style={{ backgroundColor: "#f5f5f5" }} // istersen görsel iyileştirme
          />
          {errors.email && (
            <Alert type="error" message={errors.email} showIcon />
          )}

          <Input
            name="name"
            placeholder="İsim"
            value={data.name}
            onChange={handleInputChange}
            status={errors.name ? "error" : ""}
          />
          {errors.name && <Alert type="error" message={errors.name} showIcon />}
          <Input
            name="surname"
            placeholder="Soyisim"
            value={data.surname}
            onChange={handleInputChange}
            status={errors.surname ? "error" : ""}
          />
          {errors.surname && (
            <Alert type="error" message={errors.surname} showIcon />
          )}
          <Select
            style={{ width: "100%" }}
            name="gender"
            placeholder="Seçiniz"
            value={data.gender || undefined}
            onChange={(value) => handleSelectChange("gender", value)}
            status={errors.gender ? "error" : ""}
          >
            <Option value="Erkek">Erkek</Option>
            <Option value="Kadın">Kadın</Option>
            <Option value="Diğer">Diğer</Option>
          </Select>
          {errors.gender && (
            <div style={{ marginTop: 4 }}>
              <Alert type="error" message={errors.gender} showIcon />
            </div>
          )}

          <Input
            name="tcIdentityNumber"
            placeholder="T.C. Kimlik Numarası"
            value={data.tcIdentityNumber}
            onChange={handleInputChange}
            status={errors.tcIdentityNumber ? "error" : ""}
          />
          {errors.tcIdentityNumber && (
            <Alert type="error" message={errors.tcIdentityNumber} showIcon />
          )}

          <AddressFields
            title="Kişisel Adres"
            address={data.personalAddress}
            errors={errors}
            onChange={(field, value) =>
              onChange(field, value, "personalAddress")
            }
            prefix="personalAddress"
          />
        </>
      ) : (
        <>
          <Input
            name="companyName"
            placeholder="Şirket Adı"
            value={data.companyName}
            onChange={handleInputChange}
            status={errors.companyName ? "error" : ""}
          />
          {errors.companyName && (
            <Alert type="error" message={errors.companyName} showIcon />
          )}
          <Input
            name="taxNumber"
            placeholder="Vergi Numarası"
            value={data.taxNumber}
            onChange={handleInputChange}
            status={errors.taxNumber ? "error" : ""}
          />
          {errors.taxNumber && (
            <Alert type="error" message={errors.taxNumber} showIcon />
          )}
          <Input
            name="taxOffice"
            placeholder="Vergi Dairesi"
            value={data.taxOffice}
            onChange={handleInputChange}
            status={errors.taxOffice ? "error" : ""}
          />
          {errors.taxOffice && (
            <Alert type="error" message={errors.taxOffice} showIcon />
          )}

          <AddressFields
            title="Fatura Adresi"
            address={data.billingAddress}
            errors={errors}
            onChange={(field, value) =>
              onChange(field, value, "billingAddress")
            }
            prefix="billingAddress"
          />

          <AddressFields
            title="Kargo/Sevkiyat Adresi"
            address={data.shippingAddress}
            errors={errors}
            onChange={(field, value) =>
              onChange(field, value, "shippingAddress")
            }
            prefix="shippingAddress"
          />
        </>
      )}

      {/* Telefon Numarası */}
      <label>
        <span>Telefon Numarası</span>
        <PhoneInput
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
          required
        />
      </label>
      {errors.phoneNumber && (
        <Alert type="error" message={errors.phoneNumber} showIcon />
      )}

      <div style={{ marginTop: "1rem" }}>
        <Button type="primary" htmlType="submit" disabled={loading}>
          {loading ? <Spin /> : "Bilgileri Kaydet"}
        </Button>
      </div>
    </form>
  );
};

BillingForm.propTypes = {
  data: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onBillingTypeChange: PropTypes.func.isRequired,
  billingType: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default BillingForm;
