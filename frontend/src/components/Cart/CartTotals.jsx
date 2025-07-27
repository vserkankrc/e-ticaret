import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartProvider.jsx";

const CartTotals = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return <div>Sepetinizde ürün yok.</div>;
  }

  const subTotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const shippingCost = subTotal >= 100 ? 0 : 50;
  const cartTotal = subTotal + shippingCost;

  const handleClick = () => {
    // Ödeme bilgilerini localStorage'a yaz
    localStorage.setItem("paymentInfo", JSON.stringify({
      subTotal,
      shippingCost,
      cartTotal
    }));

    navigate("/payment");
  };

  return (
    <div className="cart-totals">
      <h2>Sepet Toplamı</h2>
      <table>
        <tbody>
          <tr className="cart-subtotal">
            <th>Ara Toplam</th>
            <td><span id="subtotal">₺{subTotal.toFixed(2)}</span></td>
          </tr>
          <tr>
            <th>Kargo Tutarı</th>
            <td>
              <ul>
                <li><span>₺{shippingCost.toFixed(2)}</span></li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Toplam Ödeme</th>
            <td><strong id="cart-total">₺{cartTotal.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
      <div className="checkout">
        <button onClick={handleClick} className="btn btn-lg">Sepeti Onayla</button>
      </div>
    </div>
  );
};

export default CartTotals;
