import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QuantityControl } from "../../components/quantity-control/quantity-control";
import { useCartContext } from "../../context/use-cart-context";
import { useAuth } from "../../context/use-auth";

import {
  formatPrice,
  calcSubtotal,
  calcShippingCost,
  calcTotal,
} from "../../utils/price";
import "./cart-page.css";

function CartPage() {
  const { cartItems, removeItem, increaseItem, decreaseItem, clearCart } =
    useCartContext();
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const subtotal = calcSubtotal(cartItems);
  const shippingCost = calcShippingCost(cartItems);
  const totalPrice = calcTotal(cartItems);

  function handleCheckout(): void {
    if (!loggedUser) {
      setErrorMsg("Bestellen ist nur mit einem Account möglich.");
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg("Ihr Warenkorb ist leer.");
      return;
    }
    setErrorMsg("");
    navigate("/checkout");
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-page-header">
          <h2 className="cart-page-title">Warenkorb</h2>
        </div>
        <div className="cart-empty">
          <p>Ihr Warenkorb ist leer.</p>
          <Link to="/" className="cart-empty-link">
            Weiter stöbern
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-page-header">
        <h2 className="cart-page-title">Warenkorb</h2>
        <button className="cart-clear-btn" onClick={clearCart}>
          Warenkorb leeren
          <img src="./assets/icons/delete_red.png" alt="Warenkorb leeren" />
        </button>
      </div>

      <div className="cart-page-content">
        <div className="cart-page-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-cover">
                <img src={item.cover} alt={item.title} />
              </div>
              <div className="cart-item-info">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-author">Autor: {item.author}</p>
              </div>
              <div className="cart-item-actions">
                <QuantityControl
                  quantity={item.quantity}
                  onIncrease={() => increaseItem(item.id)}
                  onDecrease={() => decreaseItem(item.id)}
                />
                <span className="cart-item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3 className="cart-summary-title">Übersicht</h3>
          <div className="cart-summary-row">
            <span>Zwischensumme:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Versandkosten:</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
          <div className="cart-summary-row cart-summary-row--total">
            <span>Gesamtsumme:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button
            className="cart-summary-checkout-btn"
            onClick={handleCheckout}
            disabled={!loggedUser}
          >
            Zur Kasse gehen
          </button>

          {errorMsg && <p className="cart-summary-error">{errorMsg}</p>}
          {!loggedUser && (
            <p className="cart-summary-hint">
              Bestellen ist nur mit einem Account möglich. Bitte im Header
              einloggen.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default CartPage;