import "./order-page.css";
import { Component } from "react";
import type { User, Order } from "../../interface/user";
import { OrderCard } from "../../components/order/order-card";
import { getOrders, splitOrdersByStatus } from "../../services/order-service";
import { visibleItems, hasMoreItems } from "../../utils/load-more";

const PAGE_SIZE = 4;

interface OrdersPageProps {
  user: User;
  onNavigateToDetail?: (orderId: string | number) => void;
}

interface OrdersPageState {
  orders: Order[];
  isLoading: boolean;
  visibleCountActive: number;
  visibleCountHistory: number;
}

export class OrdersPage extends Component<OrdersPageProps, OrdersPageState> {
  state: OrdersPageState = {
    orders: [],
    isLoading: true,
    visibleCountActive: PAGE_SIZE,
    visibleCountHistory: PAGE_SIZE,
  };

  componentDidMount() {
    this.loadOrders();
  }

  private async loadOrders() {
    this.setState({ isLoading: true });
    const orders = await getOrders(this.props.user);
    this.setState({ orders, isLoading: false });
  }

  private handleLoadMoreActive = () => {
    this.setState((prev) => ({
      visibleCountActive: prev.visibleCountActive + PAGE_SIZE,
    }));
  };

  private handleLoadMoreHistory = () => {
    this.setState((prev) => ({
      visibleCountHistory: prev.visibleCountHistory + PAGE_SIZE,
    }));
  };

  private renderOrderList(
    orders: Order[],
    count: number,
    variant: "history" | "active",
    onLoadMore: () => void,
  ) {
    if (orders.length === 0) {
      return (
        <span className="empty-content">Keine Bestellungen vorhanden.</span>
      );
    }

    const items = visibleItems(orders, count);

    return (
      <>
        <div className="order-grid">
          {items.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              variant={variant}
              onDetailClick={this.props.onNavigateToDetail}
            />
          ))}
        </div>

        {hasMoreItems(orders, count) && (
          <button className="load-more-btn" onClick={onLoadMore}>
            Mehr laden
          </button>
        )}
      </>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="orders-page-loading">Bestellungen werden geladen…</div>
      );
    }

    const { active, history } = splitOrdersByStatus(this.state.orders);

    return (
      <div className="orders-page">
        <h1>Meine Bestellungen</h1>

        <section className="orders-section">
          <h2>Laufende Bestellungen</h2>
          {this.renderOrderList(
            active,
            this.state.visibleCountActive,
            "active",
            this.handleLoadMoreActive,
          )}
        </section>

        <section className="orders-section">
          <h2>Frühere Bestellungen</h2>
          {this.renderOrderList(
            history,
            this.state.visibleCountHistory,
            "history",
            this.handleLoadMoreHistory,
          )}
        </section>
      </div>
    );
  }
}
