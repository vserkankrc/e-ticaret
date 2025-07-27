import PropTypes from "prop-types";

const CartSummary = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-summary">
      <h3>Sipariş Özeti</h3>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <div>{item.name}</div>
            <div>{item.quantity} x ₺{item.price}</div>
          </li>
        ))}
      </ul>
      <hr />
      <div className="total">Toplam: ₺{total.toFixed(2)}</div>
    </div>
  );
};

CartSummary.propTypes = {
  items: PropTypes.array.isRequired,
};

export default CartSummary;
