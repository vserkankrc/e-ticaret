import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { message, Spin } from "antd";
import axios from "@/utils/axios";
import { CartContext } from "@/context/CartProvider";

import AddressAndCustomerTypeForm from "./AddressAndCustomerTypeForm";
import SavedCards from "./SavedCards";
import NewCardForm from "./NewCardForm";
import CartSummary from "./CartSummary";
import AgreementSection from "./AgreementSection";

const PaymentForm = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [userDetails, setUserDetails] = useState(null);

  const [paymentMethod] = useState("iyzico");
  const [acceptedContract, setAcceptedContract] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isFlipped, setIsFlipped] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProcessingPayment) return;

    if (!acceptedContract)
      return message.warning("Lütfen satış sözleşmesini onaylayın");

    if (!selectedAddressId)
      return message.warning("Teslimat adresi seçmelisiniz");

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
        image: item.image || (item.images?.[0] || ""),
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

      await axios.post("/api/orders/checkout", orderPayload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      message.success("Ödeme başarılı! Siparişiniz oluşturuldu");
      localStorage.removeItem("paymentInfo");
      clearCart();
      navigate("/profile", { state: { activeTab: "orders" } });
    } catch (error) {
      console.error("Sipariş oluşturulurken hata:", error);
      message.error(error.response?.data?.message || "Ödeme işlemi başarısız");
    } finally {
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

          <SavedCards onCardSelect={setSelectedCardId} />

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

          <AgreementSection
            accepted={acceptedContract}
            setAccepted={setAcceptedContract}
          />

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
