import { Component } from "react";
import { Link } from "react-router-dom";
import type { User } from "../../interface/user";
import type { Order } from "../../interface/order";

import { getOrderById, statusLabel, cancelOrder } from "../../services/order-service";
import { CancelOrderModal } from "../../components/order/cancel-order-modal";
import { formatPrice, calcSubtotal } from "../../utils/price";
import "../order-page/order-page.css";
import "./order-detail-page.css";

type OrderItem = Order["items"][number];

/** Props accepted by {@link OrderDetailPage}. */
interface OrderDetailPageProps {
  /** Active user profile instance. */
  user: User;
  /** Unique ID of the order to retrieve and render. */
  orderId: string;
  /** Navigation callback to return to the order list view. */
  onBack: () => void;
}

/** Component state for {@link OrderDetailPage}. */
interface OrderDetailPageState {
  /** Resolved order details, or `null` if not found. */
  order: Order | null;
  /** Flag indicating active order data fetch status. */
  isLoading: boolean;
  /** Controls visibility of the order cancellation confirmation modal. */
  showCancelModal: boolean;
}

/**
 * Calculates shipping cost based on the difference between total price and item subtotal.
 *
 * @param order - The target order object.
 * @returns Shipping cost rounded to 2 decimal places, clamped at minimum 0.
 */
function calcShipping(order: Order): number {
  const diff = order.totalPrice - calcSubtotal(order.items);
  return Math.max(0, Math.round(diff * 100) / 100);
}

/**
 * Class component displaying exhaustive information for a single order, including order items,
 * financial totals, cancellation actions, and modal confirmations.
 */
export class OrderDetailPage extends Component<
  OrderDetailPageProps,
  OrderDetailPageState
> {
  state: OrderDetailPageState = {
    order: null,
    isLoading: true,
    showCancelModal: false,
  };

  componentDidMount() {
    this.loadOrder();
  }

  componentDidUpdate(prev: OrderDetailPageProps) {
    if (prev.orderId !== this.props.orderId) this.loadOrder();
  }

  /** Fetches target order details asynchronously based on active props. */
  private async loadOrder() {
    this.setState({ isLoading: true });
    const order = await getOrderById(this.props.orderId);
    this.setState({ order, isLoading: false });
  }

  /** Opens order cancellation modal dialog. */
  private handleOpenCancelModal = () => {
    this.setState({ showCancelModal: true });
  };

  /** Closes order cancellation modal dialog. */
  private handleCloseCancelModal = () => {
    this.setState({ showCancelModal: false });
  };

  /** Sends cancellation command for current order and refreshes component state. */
  private handleConfirmCancel = async () => {
    if (!this.state.order) return;

    await cancelOrder(this.props.user, this.state.order.id);
    this.setState({ showCancelModal: false });
    await this.loadOrder();
  };

  /** Renders fallback UI when specified order cannot be found. */
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

  /** Renders header details including order ID, date, status badge, and action buttons. */
  private renderHeader(order: Order) {
    const canCancel = order.status === "processing";

    return (
      <div className="order-detail-header">
        <div>
          <h1>Bestellung #{order.id}</h1>
          <p className="order-detail-meta">Bestellt am: {order.orderDate}</p>
          {order.deliveredDate && (
            <p className="order-detail-meta">Geliefert am: {order.deliveredDate}</p>
          )}
        </div>
        <div className="order-detail-header-actions">
          <div className="order-detail-badge">{statusLabel(order.status)}</div>
          {canCancel && (
            <button type="button" className="order-cancel-btn" onClick={this.handleOpenCancelModal}>
              Bestellung stornieren
            </button>
          )}
        </div>
      </div>
    );
  }

  /** Renders title, author, quantity, and unit price for an order item. */
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

  /** Renders a single order line item as a clickable link pointing to its product page. */
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

  /** Renders list container for all purchased items in the order. */
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

  /** Renders formatted text row within the order summary section. */
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

  /** Renders cost breakdown including subtotal, calculated shipping, and total sum. */
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
    const { order, isLoading, showCancelModal } = this.state;
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
        {showCancelModal && (
          <CancelOrderModal
            orderId={order.id}
            onConfirm={this.handleConfirmCancel}
            onCancel={this.handleCloseCancelModal}
          />
        )}
      </div>
    );
  }
}

export default OrderDetailPage;