import { Component } from "react";
import { Link } from "react-router-dom";
import type { User } from "../../interface/user";
import "./cart-page.css";

export interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  cover?: string;
  quantity: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  loggedUser: User | null;
  errorMsg: string;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  setErrorMsg: (msg: string) => void;
}

export class CartPage extends Component<CartPageProps> {
  get subtotal(): number {
    return this.props.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get shippingCost(): number {
    return this.props.cartItems.length > 0 ? 3.95 : 0;
  }

  get totalPrice(): number {
    return this.subtotal + this.shippingCost;
  }

  formatPrice(value: number): string {
    return `${value.toFixed(2).replace(".", ",")} €`;
  }

  handleCheckout = (): void => {
    const { loggedUser, cartItems, setErrorMsg, onCheckout } = this.props;
    if (!loggedUser) {
      setErrorMsg("Bestellen ist nur mit einem Account möglich.");
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg("Ihr Warenkorb ist leer.");
      return;
    }
    setErrorMsg("");
    onCheckout();
  };

  private renderEmptyState() {
    return (
      <div className="cart-empty">
        <p>Ihr Warenkorb ist leer.</p>
        <Link to="/" className="cart-empty-link">
          Weiter stöbern
        </Link>
      </div>
    );
  }

  private renderItemCover(item: CartItem) {
    return (
      <div className="cart-item-cover">
        <img src={item.cover} alt={item.title} />
      </div>
    );
  }

  private renderItemInfo(item: CartItem) {
    return (
      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-author">Autor: {item.author}</p>
        <p className="cart-item-quantity">
          {item.quantity} × {this.formatPrice(item.price)}
        </p>
      </div>
    );
  }

  private renderItemActions(item: CartItem) {
    return (
      <div className="cart-item-actions">
        <span className="cart-item-price">
          {this.formatPrice(item.price * item.quantity)}
        </span>
        <button className="cart-item-remove" onClick={() => this.props.onRemoveItem(item.id)}>
          Entfernen
        </button>
      </div>
    );
  }

  private renderItem(item: CartItem) {
    return (
      <div key={item.id} className="cart-item">
        {this.renderItemCover(item)}
        {this.renderItemInfo(item)}
        {this.renderItemActions(item)}
      </div>
    );
  }

  private renderSummaryRow(label: string, value: string, isTotal = false) {
    const rowClass = isTotal ? "cart-summary-row cart-summary-row--total" : "cart-summary-row";
    return (
      <div className={rowClass}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
    );
  }

  private renderSummaryTotals() {
    return (
      <>
        {this.renderSummaryRow("Zwischensumme:", this.formatPrice(this.subtotal))}
        {this.renderSummaryRow("Versandkosten:", this.formatPrice(this.shippingCost))}
        {this.renderSummaryRow("Gesamtsumme:", this.formatPrice(this.totalPrice), true)}
      </>
    );
  }

  private renderSummaryMessages() {
    const { loggedUser, errorMsg } = this.props;
    return (
      <>
        {errorMsg && <p className="cart-summary-error">{errorMsg}</p>}
        {!loggedUser && (
          <p className="cart-summary-hint">
            Bestellen ist nur mit einem Account möglich. Bitte im Header einloggen.
          </p>
        )}
      </>
    );
  }

  private renderSummary() {
    return (
      <aside className="cart-summary">
        <h3 className="cart-summary-title">Übersicht</h3>
        {this.renderSummaryTotals()}
        <button
          className="cart-summary-checkout-btn"
          onClick={this.handleCheckout}
          disabled={!this.props.loggedUser}
        >
          Zur Kasse gehen
        </button>
        {this.renderSummaryMessages()}
      </aside>
    );
  }

  render() {
    const { cartItems } = this.props;
    if (cartItems.length === 0) {
      return (
        <section className="cart-page">
          <h2 className="cart-page-title">Warenkorb</h2>
          {this.renderEmptyState()}
        </section>
      );
    }
    return (
      <section className="cart-page">
        <h2 className="cart-page-title">Warenkorb</h2>
        <div className="cart-page-content">
          <div className="cart-page-items">
            {cartItems.map((item) => this.renderItem(item))}
          </div>
          {this.renderSummary()}
        </div>
      </section>
    );
  }
}