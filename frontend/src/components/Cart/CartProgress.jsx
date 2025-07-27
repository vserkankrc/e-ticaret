import { useContext } from 'react';
import { CartContext } from "../../context/CartProvider.jsx";

const CartProgress = () => {
  const { cartItems } = useContext(CartContext);

  const freeShippingThreshold = 350;

  // Toplam fiyatı hesapla
  const subTotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const progressPercentage = Math.min((subTotal / freeShippingThreshold) * 100, 100);
  const remainingAmount = Math.max(freeShippingThreshold - subTotal, 0).toFixed(2);

  return (
    <div className="free-progress-bar p-4 rounded-xl shadow-md bg-white border border-gray-200 my-4">
      {subTotal >= freeShippingThreshold ? (
        <p className="text-green-600 font-semibold text-center mb-2">
          🎉 Tebrikler! Kargonuz bedava.
        </p>
      ) : (
        <p className="text-gray-700 text-center mb-2">
          Sepete <strong className="text-orange-600">₺{remainingAmount}</strong> daha ekleyin ve <strong>ücretsiz gönderim</strong> kazanın!
        </p>
      )}

      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CartProgress;
