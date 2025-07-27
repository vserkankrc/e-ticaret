import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios"; // ✅ axios yerine kendi oluşturduğumuz instance'ı kullanıyoruz

const AddressAndCustomerTypeForm = ({
  addresses,
  setAddresses,
  selectedAddressId = "",
  setSelectedAddressId,
  setUserDetails,
}) => {
  const [localAddresses, setLocalAddresses] = useState(addresses || []);
// ...component içinde
const navigate = useNavigate();
  useEffect(() => {
    setLocalAddresses(addresses || []);
  }, [addresses]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get("/api/users/profile"); // ✅ baseURL otomatik
        const fetchedAddresses = [];


        const { personalAddress, billingAddress, shippingAddress, name, email } = res.data;

        if (personalAddress) {
          fetchedAddresses.push({
            _id: "personal",
            label: personalAddress.label || "Kişisel",
            addressDetail: personalAddress.address || "",
            province: personalAddress.province || "",
            district: personalAddress.district || "",
            postalCode: personalAddress.postalCode || "",
            country: personalAddress.country || "",
          });
        }


        if (billingAddress) {
          fetchedAddresses.push({
            _id: "billing",
            label: billingAddress.label || "Fatura",
            addressDetail: billingAddress.address || "",
            province: billingAddress.province || "",
            district: billingAddress.district || "",
            postalCode: billingAddress.postalCode || "",
            country: billingAddress.country || "",
          });
        }

        if (shippingAddress) {
          fetchedAddresses.push({
            _id: "shipping",
            label: shippingAddress.label || "Teslimat",
            addressDetail: shippingAddress.address || "",
            province: shippingAddress.province || "",
            district: shippingAddress.district || "",
            postalCode: shippingAddress.postalCode || "",
            country: shippingAddress.country || "",
          });
        }

        setLocalAddresses(fetchedAddresses);
        setAddresses(fetchedAddresses);
        setUserDetails({ name, email });

        const defaultAddress =
          fetchedAddresses.find((a) => (a.label || "").toLowerCase().includes("ev")) ||
          fetchedAddresses.find((a) => (a.label || "").toLowerCase().includes("fatura"));

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        } else if (fetchedAddresses.length > 0) {
          setSelectedAddressId(fetchedAddresses[0]._id);
        }
      } catch (error) {
        console.error("Profil ve adres verisi alınamadı:", error);
      }
    };

    fetchProfileData();
  }, [setAddresses, setSelectedAddressId, setUserDetails]);

  const selectedAddress = localAddresses.find(
    (addr) => addr._id === selectedAddressId
  );

  return (
    <div className="address-customer-type-form">
      <label htmlFor="address-select">Teslimat Adresi</label>
  
      {localAddresses.length === 0 ? (
        <div style={{ marginTop: "10px", color: "#d9534f" }}>
          <p>Henüz bir adres tanımlamamışsınız.</p>
          <button
            type="button"
            onClick={() => navigate("/profile/my-details")}
            style={{
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Adres Ekle
          </button>
        </div>
      ) : (
        <>
          <select
            id="address-select"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
            required
          >
            <option value="">Adres seçiniz</option>
            {localAddresses.map((address) => (
              <option key={address._id} value={address._id}>
                {`${address.label} - ${address.addressDetail}, ${address.province}`}
              </option>
            ))}
          </select>
  
          {selectedAddress && (
            <div
              className="selected-address-details"
              style={{ marginTop: "10px" }}
            >
              {/* Seçilen adresin detayları burada gösterilebilir */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

AddressAndCustomerTypeForm.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      label: PropTypes.string,
      addressDetail: PropTypes.string,
      province: PropTypes.string,
      district: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
    })
  ),
  selectedAddressId: PropTypes.string,
  setSelectedAddressId: PropTypes.func.isRequired,
  setAddresses: PropTypes.func.isRequired,
  setUserDetails: PropTypes.func.isRequired,
};

export default AddressAndCustomerTypeForm;
