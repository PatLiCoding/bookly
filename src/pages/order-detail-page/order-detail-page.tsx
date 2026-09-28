import { Component } from "react";
import { Link } from "react-router-dom";
import type { User, Order } from "../../interface/user";
import { getOrders, statusLabel } from "../../services/order-service";
import { formatPrice, calcSubtotal } from "../../utils/price";
import "../order-page/order-page.css";
import "./order-detail-page.css";

type OrderItem = Order["items"][number];

interface OrderDetailPageProps {
  user: User;
  orderId: string;
  onBack: () => void;
}

interface OrderDetailPageState {
  order: Order | null;
  isLoading: boolean;
}

/**
 * Shipping costs = total price minus item prices.
 * Rounded to 2 decimals to avoid floating point errors.
 */
function calcShipping(order: Order): number {
  const diff = order.totalPrice - calcSubtotal(order.items);
  return Math.max(0, Math.round(diff * 100) / 100);
}

export class OrderDetailPage extends Component<
  OrderDetailPageProps,
  OrderDetailPageState
> {
  state: OrderDetailPageState = { order: null, isLoading: true };

  componentDidMount() {
    this.loadOrder();
  }

  componentDidUpdate(prev: OrderDetailPageProps) {
    if (prev.orderId !== this.props.orderId) this.loadOrder();
  }

  private async loadOrder() {
    this.setState({ isLoading: true });
    const orders = await getOrders(this.props.user);
    const order = orders.find((o) => String(o.id) === this.props.orderId);
    this.setState({ order: order ?? null, isLoading: false });
  }

  private renderNotFound() {
    return (
      <div className="orders-page">
        <button className="order-back-btn" onClick={this.props.onBack}>
          &larr; Zurück zu meinen Bestellungen
        </button>
        <div className="order-detail-card">
          <p>Bestellung nicht gefunden.</p>
        </div>
      </div>
    );
  }

  private renderHeader(order: Order) {
    return (
      <div className="order-detail-header">
        <div>
          <h1>Bestellung #{order.id}</h1>
          <p className="order-detail-meta">Bestellt am: {order.orderDate}</p>
          {order.deliveredDate && (
            <p className="order-detail-meta">Geliefert am: {order.deliveredDate}</p>
          )}
        </div>
        <div className="order-detail-badge">{statusLabel(order.status)}</div>
      </div>
    );
  }

  private renderItemDetails(item: OrderItem) {
    return (
      <div className="order-item-details">
        <span className="order-item-title">{item.title}</span>
        {item.author && <span className="order-item-author">von {item.author}</span>}
        <span className="order-item-price">
          {item.quantity} × {formatPrice(item.price)}
        </span>
      </div>
    );
  }

  /** Renders one ordered item; clicking it opens the book details page. */
  private renderItem(item: OrderItem) {
    return (
      <Link
        key={item.id}
        to={`/book/${item.bookId}`}
        className="order-item order-item-link"
      >
        <img className="order-item-cover" src={item.bookCover} alt={item.title} />
        {this.renderItemDetails(item)}
      </Link>
    );
  }

  private renderItems(order: Order) {
    return (
      <section className="orders-section">
        <h2>Bestellte Artikel ({order.items.length})</h2>
        <div className="order-items">
          {order.items.map((item) => this.renderItem(item))}
        </div>
      </section>
    );
  }

  private renderSummaryRow(label: string, value: string, isTotal = false) {
    const className = isTotal
      ? "order-summary-row order-detail-total"
      : "order-summary-row";
    return (
      <p className={className}>
        <span>{label}</span>
        <strong>{value}</strong>
      </p>
    );
  }

  private renderSummary(order: Order) {
    const shipping = calcShipping(order);
    const shippingText = shipping > 0 ? formatPrice(shipping) : "kostenlos";
    return (
      <div className="order-detail-summary">
        {this.renderSummaryRow("Zwischensumme", formatPrice(calcSubtotal(order.items)))}
        {this.renderSummaryRow("Versandkosten", shippingText)}
        {this.renderSummaryRow("Gesamtsumme", formatPrice(order.totalPrice), true)}
      </div>
    );
  }

  render() {
    const { order, isLoading } = this.state;
    if (isLoading) return <div className="orders-page-loading">Lädt…</div>;
    if (!order) return this.renderNotFound();

    return (
      <div className="orders-page">
        <button className="order-back-btn" onClick={this.props.onBack}>
          &larr; Zurück zur Übersicht
        </button>

        <div className="order-detail-card">
          {this.renderHeader(order)}
          {this.renderItems(order)}
          {this.renderSummary(order)}
        </div>
      </div>
    );
  }
}