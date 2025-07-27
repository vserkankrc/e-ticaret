import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// CartContext oluşturuluyor
 export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // cartItems değiştiğinde yerel depolamayı güncelle
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Kullanıcı çıkış yaptığında (localStorage'dan "user" silinince) sepeti temizle
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        setCartItems([]);
        localStorage.removeItem("cartItems");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = (cartItem) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(item => item._id === cartItem._id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + (cartItem.quantity || 1);
        if (newQuantity <= 0) {
          return prevCart.filter(item => item._id !== cartItem._id);
        }

        return prevCart.map(item =>
          item._id === cartItem._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...prevCart, { ...cartItem, quantity: cartItem.quantity || 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => prevCart.filter(item => item._id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
