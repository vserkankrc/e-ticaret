/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "@/utils/axios";
import { CartContext } from "@/context/CartProvider";

import AddressAndCustomerTypeForm from "./AddressAndCustomerTypeForm";
import SavedCards from "./SavedCards";
import NewCardForm from "./NewCardForm";
import CartSummary from "./CartSummary";
import AgreementSection from "./AgreementSection";
import ThreeDSecurity from "./ThreeDSecurity";

const PaymentForm = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const [paymentMethod] = useState("iyzico");
  const [acceptedContract, setAcceptedContract] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [use3DSecure, setUse3DSecure] = useState(true);

  useEffect(() => {
    const cartItemsLocal = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItemsLocal.length === 0) {
      message.warning("Sepetiniz boş. Ödeme sayfasına erişemezsiniz.");
      navigate("/auth/login");
    }
  }, [navigate]);

  const validateExpiry = (value) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [monthStr, yearStr] = value.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    return (
      month >= 1 &&
      month <= 12 &&
      (year > currentYear || (year === currentYear && month >= currentMonth)) &&
      year <= currentYear + 20
    );
  };

  const validateCVC = (value) => /^\d{3,4}$/.test(value);

  const decodeBase64Utf8 = (base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessingPayment) return;

    if (!acceptedContract) {
      return message.warning("Lütfen satış sözleşmesini onaylayın");
    }

    if (!selectedAddressId) {
      return message.warning("Teslimat adresi seçmelisiniz");
    }

    if (!selectedCardId) {
      if (cardNumber.replace(/\s/g, "").length !== 16)
        return message.error("Kart numarası 16 haneli olmalıdır");
      if (!validateExpiry(expiryDate))
        return message.error("Son kullanma tarihi geçersiz");
      if (!validateCVC(cvc)) return message.error("CVC kodu geçersiz");
    }

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddress) return message.error("Teslimat adresi bulunamadı");

    if (cartItems.length === 0) return message.error("Sepetiniz boş");

    const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo")) || {};
    const totalAmount = paymentInfo.cartTotal || 0;

    const orderPayload = {
      products: cartItems.map((item) => ({
        
        productId: item.productId || item._id,
        quantity: item.quantity,
        price: item.price,
        image: item.image || item.images?.[0] || "",
        color: item.selectedColor || null,
        size: item.selectedSize || null,
      })),
      totalAmount,
      trackingNumber: "",
      address: {
        province: selectedAddress.province || "",
        district: selectedAddress.district || "",
        postalCode: selectedAddress.postalCode || "",
        addressDetail:
          selectedAddress.address || selectedAddress.addressDetail || "",
        country: selectedAddress.country || "",
      },
      paymentMethod,
      agreementAccepted: acceptedContract,
      use3DSecure,
      card: selectedCardId
        ? { savedCardId: selectedCardId }
        : {
            cardHolderName: cardName,
            cardNumber: cardNumber.replace(/\s/g, ""),
            expireMonth: expiryDate.split("/")[0],
            expireYear: `20${expiryDate.split("/")[1]}`,
            cvc,
          },
      saveCard,
    };

    try {
      setIsProcessingPayment(true);

      if (use3DSecure) {
        const response = await axios.post(
          "/api/orders/checkout/3d/initialize",
          orderPayload,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data?.threeDSHtmlContent) {
          // 💾 paymentId'yi sakla
          if (response.data.paymentId) {
            localStorage.setItem("paymentId", response.data.paymentId);
          }

          const decodedHtml = decodeBase64Utf8(response.data.threeDSHtmlContent);
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = decodedHtml;

          const form = tempDiv.querySelector("form");
          if (form) {
            document.body.appendChild(form);
            form.submit();
          } else {
            message.error("3D Secure formu bulunamadı.");
            setIsProcessingPayment(false);
          }
        } else {
          message.error("3D Secure içeriği alınamadı.");
          setIsProcessingPayment(false);
        }
      } else {
        await axios.post("/api/orders/checkout", orderPayload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        message.success("Ödeme başarılı! Siparişiniz oluşturuldu");
        localStorage.removeItem("paymentInfo");
        clearCart();
        navigate("/profile", { state: { activeTab: "orders" } });
      }
    } catch (error) {
      console.error("Sipariş oluşturulurken hata:", error);
      message.error(error.response?.data?.message || "Ödeme işlemi başarısız");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="payment-page">
      <form onSubmit={handleSubmit} className="payment-grid" noValidate>
        <div className="payment-left">
          <AddressAndCustomerTypeForm
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            setAddresses={setAddresses}
            setUserDetails={setUserDetails}
          />

          {!selectedCardId && (
            <NewCardForm
              cardName={cardName}
              setCardName={setCardName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              cvc={cvc}
              setCvc={setCvc}
              saveCard={saveCard}
              setSaveCard={setSaveCard}
              setIsFlipped={setIsFlipped}
            />
          )}

          <ThreeDSecurity
            use3DSecure={use3DSecure}
            setUse3DSecure={setUse3DSecure}
          />

          <AgreementSection
            accepted={acceptedContract}
            setAccepted={setAcceptedContract}
          />

          <SavedCards onCardSelect={setSelectedCardId} />

          <button
            type="submit"
            className="payment-submit-btn"
            disabled={!acceptedContract || isProcessingPayment}
          >
            {isProcessingPayment ? "Ödeme Yapılıyor..." : "Ödeme Yap"}
          </button>
        </div>

        <div className="payment-right">
          <CartSummary items={cartItems} />
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
