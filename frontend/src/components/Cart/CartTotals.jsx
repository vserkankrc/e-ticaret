import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartProvider.jsx";
import PropTypes from "prop-types";

const CartTotals = ({ discount, appliedCoupon }) => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return <div>Sepetinizde ürün yok.</div>;
  }

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subTotal >= 100 ? 0 : 50;
  const discountAmount = (subTotal * discount) / 100;
  const cartTotal = subTotal - discountAmount + shippingCost;

  const handleClick = () => {
    localStorage.setItem(
      "paymentInfo",
      JSON.stringify({
        subTotal,
        shippingCost,
        discountAmount,
        cartTotal,
        appliedCoupon,
      })
    );
    navigate("/payment");
  };

  return (
    <div className="cart-totals">
      <h2>Sepet Toplamı</h2>
      <table>
        <tbody>
          <tr>
            <th>Ara Toplam</th>
            <td>₺{subTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Kargo Tutarı</th>
            <td>₺{shippingCost.toFixed(2)}</td>
          </tr>
          {discount > 0 && (
            <tr>
              <th>Kupon İndirimi ({appliedCoupon} - %{discount})</th>
              <td>-₺{discountAmount.toFixed(2)}</td>
            </tr>
          )}
          <tr>
            <th>Toplam Ödeme</th>
            <td><strong>₺{cartTotal.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
      <div className="checkout">
        <button onClick={handleClick} className="btn btn-lg">
          Sepeti Onayla
        </button>
      </div>
    </div>
  );
};

CartTotals.propTypes = {
  discount: PropTypes.number.isRequired,
  appliedCoupon: PropTypes.string.isRequired,
};

export default CartTotals;
