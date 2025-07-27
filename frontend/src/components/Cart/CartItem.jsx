import PropTypes from 'prop-types';
import { useContext } from 'react';
import { CartContext } from "../../context/CartProvider.jsx";

const CartItem = ({ cartItem }) => {
  const { removeFromCart, addToCart } = useContext(CartContext);

  const handleDecrease = () => {
    if (cartItem.quantity > 1) {
      // Miktarı 1 azalt
      addToCart({ ...cartItem, quantity: -1 });
    } else {
      // Ürünü tamamen kaldır
      removeFromCart(cartItem._id);
    }
  };

  const cartItemTotal = (cartItem.price * cartItem.quantity).toFixed(2);

  return (
    <tr className="cart-item">
      <td></td>
      <td className="cart-image">
        <img src={cartItem.images?.[0] || "/placeholder.jpg"} alt={cartItem.name} />
        <i
          className="bi bi-x delete-cart"
          onClick={handleDecrease}
          title="Sepetten 1 adet çıkar"
        ></i>
      </td>
      <td>{cartItem.name}</td>
      <td>₺{cartItem.price.toFixed(2)}</td>
      <td className="product-quantity">{cartItem.quantity}</td>
      <td className="product-subtotal">₺{cartItemTotal}</td>
    </tr>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.array,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartItem;
