import "./order-card.css";
import { Component } from "react";
import type { Order } from "../../interface/order";
import { statusLabel } from "../../services/order-service";
import { getCover } from "../../utils/book-cover";

interface OrderCardProps {
  order: Order;
  variant: "history" | "active";
  onDetailClick?: (orderId: string | number) => void;
  onCancelClick?: (orderId: string | number) => void;
}

export class OrderCard extends Component<OrderCardProps> {
  private renderItemsPreview() {
    const { items } = this.props.order;
    const maxVisible = 2;
    const visibleItems = items.slice(0, maxVisible);
    const remainingCount = items.length - maxVisible;

    return (
      <div className="order-card-preview">
        <div className="order-card-covers">
          {visibleItems.map((item) => (
            <img
              key={item.id}
              className="order-cover-thumb"
              src={getCover(item.bookCover)}
              alt={item.title}
              title={item.title}
            />
          ))}

          {remainingCount > 0 && (
            <div className="order-cover-more">+{remainingCount}</div>
          )}
        </div>

        <div className="order-card-summary">
          <p className="order-item-count">
            {items.length} {items.length === 1 ? "Artikel" : "Artikel"}
          </p>
          <p className="order-total">
            Gesamt:{" "}
            <strong>
              {this.props.order.totalPrice.toFixed(2).replace(".", ",")} €
            </strong>
          </p>
        </div>
      </div>
    );
  }

  render() {
    const { order, variant, onDetailClick, onCancelClick } = this.props;

    return (
      <div className="order-card">
        <div className="order-card-header">
          <div className="order-date-info">
            <span className="order-label">Bestellt am:</span> {order.orderDate}
          </div>

          {variant === "history" ? (
            <div className="order-delivered-info">
              <span className="order-label">Geliefert am:</span>{" "}
              {order.deliveredDate ?? "-"}
            </div>
          ) : (
            <div className="order-status-badge">
              {statusLabel(order.status)}
            </div>
          )}
        </div>

        <div className="order-card-body">{this.renderItemsPreview()}</div>

        {onDetailClick && (
          <div className="order-card-footer">
            {order.status === "processing" && onCancelClick && (
              <button
                type="button"
                className="order-cancel-btn"
                onClick={() => onCancelClick(order.id)}
              >
                Stornieren
              </button>
            )}
            <button
              type="button"
              className="order-detail-btn"
              onClick={() => onDetailClick(order.id)}
            >
              Bestelldetails anzeigen
            </button>
          </div>
        )}
      </div>
    );
  }
}