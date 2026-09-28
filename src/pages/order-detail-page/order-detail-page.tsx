import { Component } from "react";
import type { User, Order } from "../../interface/user";
import { getOrders, statusLabel } from "../../services/order-service";
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
        <div className="order-detail-badge">
          {statusLabel(order.status)}
        </div>
      </div>
    );
  }

  private renderItem(item: OrderItem) {
  const itemPrice = typeof item.price === "number" 
    ? item.price.toFixed(2).replace(".", ",") + " €"
    : item.price;

  return (
    <div key={item.id} className="order-item">
      <img className="order-item-cover" src={item.bookCover} alt={item.title} />
      <div className="order-item-details">
        <span className="order-item-title">{item.title}</span>
        {item.author && (
          <span className="order-item-author">von {item.author}</span>
        )}
        {itemPrice && (
          <span className="order-item-price">{itemPrice}</span>
        )}
      </div>
    </div>
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

  private renderTotal(order: Order) {
    const price = order.totalPrice.toFixed(2).replace(".", ",");
    return (
      <p className="order-detail-total">
        Gesamtsumme: <strong>{price} €</strong>
      </p>
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
          {this.renderTotal(order)}
        </div>
      </div>
    );
  }
}