import PropTypes from "prop-types";
import { Input, Alert, Select } from "antd";
import citiesSelect from "../../../data/citiesSelect.json";
import cityDistrictMap from "../../../data/cityDistrictMap.json";

const { Option } = Select;

const AddressFields = ({ title, address, errors, onChange, prefix }) => {
  const fieldName = (field) => (prefix ? `${prefix}.${field}` : field);

  const provinceList = citiesSelect; // [{ sehir_id, sehir_adi }, ...]

  // Şehir ismini alıyoruz (örneğin "ADANA")
  const selectedCityName = address.province;

  // İlçeleri şehir adına göre filtreliyoruz
  const districtList = selectedCityName
    ? cityDistrictMap.filter((district) => district.sehir_adi === selectedCityName)
    : [];

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  // Seçilen şehir id'sinden şehir adını bulup kaydediyoruz
  const handleCityChange = (selectedCityId) => {
    const cityName =
      provinceList.find((city) => city.sehir_id === selectedCityId)?.sehir_adi || "";
    handleChange("province", cityName); // Artık city name gönderiyoruz
    handleChange("district", undefined);
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {title && <h3>{title}</h3>}

      <Input
        placeholder="Adres"
        value={address.address || ""}
        onChange={(e) => handleChange("address", e.target.value)}
        status={errors?.[fieldName("address")] ? "error" : ""}
      />
      {errors?.[fieldName("address")] && (
        <Alert
          type="error"
          message={errors[fieldName("address")]}
          showIcon
          style={{ marginBottom: 8 }}
        />
      )}

      <Input
        placeholder="Adres Detayı"
        value={address.addressDetail || ""}
        onChange={(e) => handleChange("addressDetail", e.target.value)}
        status={errors?.[fieldName("addressDetail")] ? "error" : ""}
      />
      {errors?.[fieldName("addressDetail")] && (
        <Alert
          type="error"
          message={errors[fieldName("addressDetail")]}
          showIcon
          style={{ marginBottom: 8 }}
        />
      )}

      {/* İl Seçimi */}
      <Select
        placeholder="İl"
        value={
          provinceList.find((c) => c.sehir_adi === selectedCityName)?.sehir_id || undefined
        }
        onChange={handleCityChange}
        status={errors?.[fieldName("province")] ? "error" : ""}
        style={{ width: "100%", marginBottom: 8 }}
        allowClear
      >
        {provinceList.map(({ sehir_id, sehir_adi }) => (
          <Option key={sehir_id} value={sehir_id}>
            {sehir_adi}
          </Option>
        ))}
      </Select>
      {errors?.[fieldName("province")] && (
        <Alert
          type="error"
          message={errors[fieldName("province")]}
          showIcon
          style={{ marginBottom: 8 }}
        />
      )}

      {/* İlçe Seçimi */}
      <Select
        placeholder="İlçe"
        value={address.district || undefined}
        onChange={(value) => handleChange("district", value)}
        status={errors?.[fieldName("district")] ? "error" : ""}
        style={{ width: "100%", marginBottom: 8 }}
        allowClear
        disabled={!selectedCityName}
      >
        {districtList.map(({ ilce_id, ilce_adi }) => (
          <Option key={ilce_id} value={ilce_adi}>
            {ilce_adi}
          </Option>
        ))}
      </Select>
      {errors?.[fieldName("district")] && (
        <Alert
          type="error"
          message={errors[fieldName("district")]}
          showIcon
          style={{ marginBottom: 8 }}
        />
      )}

      <Input
        placeholder="Posta Kodu"
        value={address.postalCode || ""}
        onChange={(e) => handleChange("postalCode", e.target.value)}
        status={errors?.[fieldName("postalCode")] ? "error" : ""}
      />
      {errors?.[fieldName("postalCode")] && (
        <Alert
          type="error"
          message={errors[fieldName("postalCode")]}
          showIcon
          style={{ marginBottom: 8 }}
        />
      )}
    </div>
  );
};

AddressFields.propTypes = {
  title: PropTypes.string,
  address: PropTypes.shape({
    address: PropTypes.string,
    addressDetail: PropTypes.string,
    province: PropTypes.string, // Artık şehir ismi
    district: PropTypes.string,
    postalCode: PropTypes.string,
  }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  prefix: PropTypes.string,
};

export default AddressFields;
