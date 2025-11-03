
import PropTypes from "prop-types";

const CartSummary = ({ items }) => {
  // Subtotal ve discount hesapla
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) => sum + Math.round((item.price * (item.discount || 0)) / 100) * item.quantity,
    0
  );

  const total = subTotal - totalDiscount;

  return (
    <div className="cart-summary">
      <h3>Sipariş Özeti</h3>
      <ul>
        {items.map((item) => {
          const discountedPrice = Math.round(item.price * (1 - (item.discount || 0) / 100));
          return (
            <li key={item._id}>
              <div>{item.name}</div>
              <div>
                {item.quantity} x ₺{item.price}
                {item.discount ? (
                  <>
                    {" "}
                    - {item.discount}% = ₺{discountedPrice}
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <hr />
      <div>
        <strong>Toplam:</strong> ₺{subTotal.toFixed(2)}
      </div>
      {totalDiscount > 0 && (
        <>
          <div>
            <strong>İndirim:</strong> -₺{totalDiscount.toFixed(2)}
          </div>
          <div>
            <strong>İndirimli Toplam:</strong> ₺{total.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

CartSummary.propTypes = {
  items: PropTypes.array.isRequired,
};

export default CartSummary;
