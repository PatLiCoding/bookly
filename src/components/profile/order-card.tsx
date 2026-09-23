import { Component } from "react";
import type { Order, OrderStatus } from "../../interface/user";

interface OrderCardProps {
  order: Order;
  variant: "history" | "active";
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Zugestellt / angekommen",
};

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
        <p className="order-status">{STATUS_LABEL[order.status]}</p>
      </>
    );
  }

  render() {
    const { order, variant } = this.props;
    return (
      <div className="order-card">
        <img className="order-cover" src={order.bookCover} alt={order.title} />
        <p className="order-title">{order.title}</p>
        <p className="order-author">{order.author}</p>
        <p className="order-price">{order.price.toFixed(2)} €</p>
        {variant === "history"
          ? this.renderHistoryFooter()
          : this.renderActiveFooter()}
      </div>
    );
  }
}
