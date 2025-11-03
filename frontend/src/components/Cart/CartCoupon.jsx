import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import api from "../../utils/axios.js";
import { CartContext } from "../../context/CartProvider.jsx";

const CartCoupon = ({ setDiscount, setAppliedCoupon }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { applyCouponToCart, cartItems } = useContext(CartContext);

  const applyCoupon = async () => {
    if (!code) return message.warning("Lütfen kupon kodunu girin.");

    try {
      setLoading(true);

      const res = await api.post("/api/coupons/validate", { code });

      const discount = res.data.discount;
      const couponCode = res.data.code;

      setDiscount(discount);
      setAppliedCoupon(couponCode);

      // 🔹 cartItems'i güncelle ve callback ile paymentInfo'yi ayarla
      applyCouponToCart(discount);

      // 🔹 paymentInfo hesaplaması için en güncel cartItems'i alıyoruz
      const updatedCart = cartItems.map(item => ({
        ...item,
        discount
      }));

      const subTotal = updatedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const discountAmount = Math.round((subTotal * discount) / 100);
      const cartTotal = subTotal - discountAmount;

      const paymentInfo = {
        subTotal,
        discountAmount,
        cartTotal,
        appliedCoupon: couponCode,
      };
      localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

      message.success(`Kupon başarıyla uygulandı! ${discount}% indirim sağlandı.`);
    } catch (err) {
      console.error("Kupon uygulama hatası:", err);
      message.error(err.response?.data?.message || "Kupon uygulanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actions-wrapper">
      <div className="coupon">
        <input
          type="text"
          className="input-text"
          placeholder="Kupon Kodu"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="btn" onClick={applyCoupon} disabled={loading}>
          {loading ? "Uygulanıyor..." : "Kupon Kodunu Uygula"}
        </button>
      </div>
    </div>
  );
};

CartCoupon.propTypes = {
  setDiscount: PropTypes.func.isRequired,
  setAppliedCoupon: PropTypes.func.isRequired,
};

export default CartCoupon;
