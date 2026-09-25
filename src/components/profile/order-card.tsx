import { Component } from "react";
import type { Order } from "../../interface/user";
import { statusLabel } from "../../services/order-service";

interface OrderCardProps {
  order: Order;
  variant: "history" | "active";
}

export class OrderCard extends Component<OrderCardProps> {
  private renderHistoryFooter() {
    const { order } = this.props;

    return (
      <>
        <p>Bestellt: {order.orderDate}</p>
        <p>Erhalten: {order.deliveredDate ?? "-"}</p>
      </>
    );
  }

  private renderActiveFooter() {
    const { order } = this.props;

    return (
      <>
        <p>Bestellt: {order.orderDate}</p>
        <p className="order-status">{statusLabel(order.status)}</p>
      </>
    );
  }

  private renderItems() {
    const { items } = this.props.order;

    return (
      <div className="order-items">
        {items.map((item) => (
          <div className="order-item" key={item.id}>
            <img
              className="order-cover"
              src={item.bookCover}
              alt={item.title}
            />

            <div>
              <p className="order-title">{item.title}</p>
              <p className="order-author">{item.author}</p>
              <p>Menge: {item.quantity}</p>
              <p>{item.price.toFixed(2).replace(".", ",")} €</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { order, variant } = this.props;

    return (
      <div className="order-card">
        {this.renderItems()}

        <p className="order-total">
          Gesamt: {order.totalPrice.toFixed(2).replace(".", ",")} €
        </p>

        {variant === "history"
          ? this.renderHistoryFooter()
          : this.renderActiveFooter()}
      </div>
    );
  }
}