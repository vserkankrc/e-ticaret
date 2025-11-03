import React, { useState } from "react";
import "./Cart.css";
import CartProgress from "./CartProgress";
import CartTable from "./CartTable";
import CartCoupon from "./CartCoupon";
import CartTotals from "./CartTotals";

const Cart = () => {
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  return (
    <React.Fragment>
      <section className="cart-page">
        <div className="container">
          <div className="cart-page-wrapper">
            <form className="cart-form">
              <CartProgress />
              <div className="shop-table-wrapper">
                <CartTable />
                <CartCoupon
                  setDiscount={setDiscount}
                  setAppliedCoupon={setAppliedCoupon}
                />
              </div>
            </form>
            <div className="cart-collaterals">
              <CartTotals
                discount={discount}
                appliedCoupon={appliedCoupon}
              />
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Cart;
