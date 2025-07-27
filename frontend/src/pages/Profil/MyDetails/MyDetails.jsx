import { useEffect, useState } from "react";
import axios from "@/utils/axios"; // Burada alias kullanıldı, senin yoluna göre ayarla
import { message as antdMessage } from "antd";
import InputMask from "react-input-mask";
import BillingForm from "./BillingForm";

const MyDetails = () => {
  const [billingType, setBillingType] = useState("bireysel");
  const [data, setData] = useState({
    email: "",
    name: "",
    surname: "",
    phoneNumber: "",
    gender: "",
    tcIdentityNumber: "",
    companyName: "",
    taxNumber: "",
    taxOffice: "",
    personalAddress: {},
    billingAddress: {},
    shippingAddress: {},
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/users/profile", {
          withCredentials: true,
          headers: { "Cache-Control": "no-cache" },
        });

        const user = res.data;

        setBillingType(user.billingType || "bireysel");

        setData({
          email: user.email || "",
          name: user.name || "",
          surname: user.surname || "",
          phoneNumber: user.phoneNumber || "",
          gender: user.gender || "",
          tcIdentityNumber: user.tcIdentityNumber || "",
          companyName: user.companyName || "",
          taxNumber: user.taxNumber || "",
          taxOffice: user.taxOffice || "",
          personalAddress: user.personalAddress || {
            label: "Ev",
            address: "",
            province: "",
            district: "",
            postalCode: "",
            country: "Türkiye",
          },
          billingAddress: user.billingAddress || {
            label: "Şirket",
            address: "",
            province: "",
            district: "",
            postalCode: "",
            country: "Türkiye",
          },
          shippingAddress: user.shippingAddress || {
            label: "Depo",
            address: "",
            province: "",
            district: "",
            postalCode: "",
            country: "Türkiye",
          },
        });
      } catch (err) {
        antdMessage.error("Profil bilgileri alınamadı.");
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value, section = null) => {
    console.log("handleChange:", { field, value, section });
    if (section) {
      setData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleBillingTypeChange = (type) => {
    setBillingType(type);
    setData((prev) => ({ ...prev, billingType: type }));
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Geçerli bir e-posta giriniz.";
    }

    if (!data.phoneNumber || data.phoneNumber.includes("_")) {
      newErrors.phoneNumber = "Telefon numarası eksik veya hatalı.";
    }

    const requiredFields = (obj, prefix) => {
      const fields = ["label", "address", "province", "district", "postalCode", "country"];
      fields.forEach((field) => {
        if (!obj[field]) {
          newErrors[`${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}`] = `${field} alanı zorunludur.`;
        }
      });
    };

    if (billingType === "bireysel") {
      if (!data.name) newErrors.name = "İsim zorunludur.";
      if (!data.surname) newErrors.surname = "Soyisim zorunludur.";
      if (!data.gender) newErrors.gender = "Cinsiyet seçiniz.";
      if (!data.tcIdentityNumber) newErrors.tcIdentityNumber = "T.C. Kimlik No zorunludur.";
      requiredFields(data.personalAddress, "personalAddress");
    } else {
      if (!data.companyName) newErrors.companyName = "Şirket adı zorunludur.";
      if (!data.taxNumber) newErrors.taxNumber = "Vergi numarası zorunludur.";
      if (!data.taxOffice) newErrors.taxOffice = "Vergi dairesi zorunludur.";
      requiredFields(data.billingAddress, "billingAddress");
      requiredFields(data.shippingAddress, "shippingAddress");
    }

    setErrors(newErrors);

    console.log("validate() errors:", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit tetiklendi");
    const isValid = validate();
    console.log("Validate sonucu:", isValid);
    if (!isValid) return;
    setLoading(true);

    try {
      const payload = {
        email: data.email,
        phoneNumber: data.phoneNumber,
        billingType,
        ...(billingType === "bireysel"
          ? {
              name: data.name,
              surname: data.surname,
              gender: data.gender,
              tcIdentityNumber: data.tcIdentityNumber,
              personalAddress: data.personalAddress,
            }
          : {
              companyName: data.companyName,
              taxNumber: data.taxNumber,
              taxOffice: data.taxOffice,
              billingAddress: data.billingAddress,
              shippingAddress: data.shippingAddress,
            }),
      };

      const res = await axios.put("/api/users/profile", payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        antdMessage.success("Bilgiler başarıyla güncellendi.");
      } else {
        antdMessage.error("Güncelleme başarısız.");
      }
    } catch (err) {
      antdMessage.error("Sunucu hatası oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BillingForm
      data={data}
      errors={errors}
      loading={loading}
      onChange={handleChange}
      onBillingTypeChange={handleBillingTypeChange}
      billingType={billingType}
      InputMask={InputMask}
      handleSubmit={handleSubmit}
    />
  );
};

export default MyDetails;
