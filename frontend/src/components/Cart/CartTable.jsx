import CartItem from "./CartItem";
import { useContext } from "react";
import { CartContext } from "../../context/CartProvider.jsx";
const CartTable = () => {
  const { cartItems } = useContext(CartContext);
  return (
    <table className="shop-table">
      <thead>
        <tr>
          <th className="product-thumbnail">&nbsp;</th>
          <th className="product-thumbnail">&nbsp;</th>
          <th className="product-name">Ürün İsmi</th>
          <th className="product-price">Tutar</th>
          <th className="product-quantity">Adet</th>
          <th className="product-subtotal">Toplam Tutar</th>
        </tr>
      </thead>
      <tbody className="cart-wrapper">
      {cartItems.map((item) => (
          <CartItem cartItem={item} key={item._id || item.id} />
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
