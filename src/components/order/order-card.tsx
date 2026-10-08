import "./order-card.css";
import { Component } from "react";
import type { Order } from "../../interface/order";
import { statusLabel } from "../../services/order-service";
import { getCover } from "../../utils/book-cover";

/** Maximum number of cover thumbnails shown before the "+n" counter. */
const MAX_VISIBLE_COVERS = 2;

/** Callback receiving an order id. */
type OrderIdHandler = (orderId: string | number) => void;

/** Props for the OrderCard component. */
interface OrderCardProps {
  /** Complete order data object. */
  order: Order;
  /** Display variant controlling date vs status badge layout (`"history"` or `"active"`). */
  variant: "history" | "active";
  /** Optional callback triggered to view detailed order information. */
  onDetailClick?: OrderIdHandler;
  /** Optional callback triggered to request order cancellation. */
  onCancelClick?: OrderIdHandler;
}

/**
 * Class component rendering an order card with item cover thumbnails, item counts, price total, and action buttons.
 */
export class OrderCard extends Component<OrderCardProps> {
  /** Renders the cover thumbnail of a single order item. */
  private renderCover(item: Order["items"][number]) {
    return (
      <img
        key={item.id}
        className="order-cover-thumb"
        src={getCover(item.bookCover)}
        alt={item.title}
        title={item.title}
      />
    );
  }

  /** Renders thumbnails for the first items and an overflow counter. */
  private renderCovers() {
    const { items } = this.props.order;
    const remaining = items.length - MAX_VISIBLE_COVERS;

    return (
      <div className="order-card-covers">
        {items.slice(0, MAX_VISIBLE_COVERS).map((item) => this.renderCover(item))}
        {remaining > 0 && <div className="order-cover-more">+{remaining}</div>}
      </div>
    );
  }

  /** Renders item count and total price. */
  private renderSummary() {
    const { items, totalPrice } = this.props.order;

    return (
      <div className="order-card-summary">
        <p className="order-item-count">{items.length} Artikel</p>
        <p className="order-total">
          Gesamt: <strong>{totalPrice.toFixed(2).replace(".", ",")} €</strong>
        </p>
      </div>
    );
  }

  /** Renders the card body with covers and summary. */
  private renderBody() {
    return (
      <div className="order-card-body">
        <div className="order-card-preview">
          {this.renderCovers()}
          {this.renderSummary()}
        </div>
      </div>
    );
  }

  /** Renders the delivery date (history variant). */
  private renderDeliveredInfo() {
    const { deliveredDate } = this.props.order;

    return (
      <div className="order-delivered-info">
        <span className="order-label">Geliefert am:</span> {deliveredDate ?? "-"}
      </div>
    );
  }

  /** Renders the status badge (active variant). */
  private renderStatusBadge() {
    const { status } = this.props.order;

    return <div className="order-status-badge">{statusLabel(status)}</div>;
  }

  /** Renders the order date plus delivery date or status badge. */
  private renderHeader() {
    const { orderDate } = this.props.order;
    const isHistory = this.props.variant === "history";

    return (
      <div className="order-card-header">
        <div className="order-date-info">
          <span className="order-label">Bestellt am:</span> {orderDate}
        </div>
        {isHistory ? this.renderDeliveredInfo() : this.renderStatusBadge()}
      </div>
    );
  }

  /** Renders the cancel button for orders that are still processing. */
  private renderCancelButton() {
    const { order, onCancelClick } = this.props;

    if (order.status !== "processing" || !onCancelClick) return null;
    return (
      <button
        type="button"
        className="order-cancel-btn"
        onClick={() => onCancelClick(order.id)}
      >
        Stornieren
      </button>
    );
  }

  /** Renders the button that opens the order details. */
  private renderDetailButton(onDetailClick: OrderIdHandler) {
    const { id } = this.props.order;

    return (
      <button
        type="button"
        className="order-detail-btn"
        onClick={() => onDetailClick(id)}
      >
        Bestelldetails anzeigen
      </button>
    );
  }

  /** Renders the footer with the available action buttons. */
  private renderFooter(onDetailClick: OrderIdHandler) {
    return (
      <div className="order-card-footer">
        {this.renderCancelButton()}
        {this.renderDetailButton(onDetailClick)}
      </div>
    );
  }

  render() {
    const { onDetailClick } = this.props;

    return (
      <div className="order-card">
        {this.renderHeader()}
        {this.renderBody()}
        {onDetailClick && this.renderFooter(onDetailClick)}
      </div>
    );
  }
}