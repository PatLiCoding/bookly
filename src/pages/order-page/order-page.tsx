import "./order-page.css";
import { Component } from "react";
import type { User } from "../../interface/user";
import type { Order } from "../../interface/order";
import { OrderCard } from "../../components/order/order-card";
import { ListToolbar } from "../../components/list-toolbar/list-toolbar";
import { getOrders, splitOrdersByStatus } from "../../services/order-service";
import { filterOrders, sortByDate } from "../../utils/list-view";
import type { SortDirection } from "../../utils/list-view";
import { visibleItems, hasMoreItems } from "../../utils/load-more";

const PAGE_SIZE = 4;

type Variant = "history" | "active";

interface OrdersPageProps {
  user: User;
  onNavigateToDetail?: (orderId: string | number) => void;
}

interface OrdersPageState {
  orders: Order[];
  isLoading: boolean;
  visibleCountActive: number;
  visibleCountHistory: number;
  query: string;
  direction: SortDirection;
}

export class OrdersPage extends Component<OrdersPageProps, OrdersPageState> {
  state: OrdersPageState = {
    orders: [],
    isLoading: true,
    visibleCountActive: PAGE_SIZE,
    visibleCountHistory: PAGE_SIZE,
    query: "",
    direction: "desc",
  };

  componentDidMount() {
    this.loadOrders();
  }

  private async loadOrders() {
    this.setState({ isLoading: true });
    const orders = await getOrders(this.props.user);
    this.setState({ orders, isLoading: false });
  }

  private shownOrders(): Order[] {
    const { orders, query, direction } = this.state;
    return sortByDate(
      filterOrders(orders, query),
      (o) => o.orderDate,
      direction,
    );
  }

  private handleQueryChange = (query: string) => {
    this.setState({
      query,
      visibleCountActive: PAGE_SIZE,
      visibleCountHistory: PAGE_SIZE,
    });
  };

  private handleDirectionChange = (direction: SortDirection) => {
    this.setState({ direction });
  };

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

  private renderToolbar() {
    const { orders, query, direction } = this.state;
    if (orders.length === 0) return null;
    return (
      <ListToolbar
        query={query}
        direction={direction}
        onQueryChange={this.handleQueryChange}
        onDirectionChange={this.handleDirectionChange}
      />
    );
  }

  private renderGrid(orders: Order[], count: number, variant: Variant) {
    return (
      <div className="order-grid">
        {visibleItems(orders, count).map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            variant={variant}
            onDetailClick={this.props.onNavigateToDetail}
          />
        ))}
      </div>
    );
  }

  private renderLoadMore(
    orders: Order[],
    count: number,
    onLoadMore: () => void,
  ) {
    if (!hasMoreItems(orders, count)) return null;
    return (
      <button className="load-more-btn" onClick={onLoadMore}>
        Mehr laden
      </button>
    );
  }

  private renderOrderList(
    orders: Order[],
    count: number,
    variant: Variant,
    onLoadMore: () => void,
  ) {
    if (orders.length === 0) return this.renderEmpty();
    return (
      <>
        {this.renderGrid(orders, count, variant)}
        {this.renderLoadMore(orders, count, onLoadMore)}
      </>
    );
  }

  private renderEmpty() {
    const text = this.state.query
      ? "Keine Treffer."
      : "Keine Bestellungen vorhanden.";
    return <span className="empty-content">{text}</span>;
  }

  private renderSection(
    title: string,
    orders: Order[],
    count: number,
    variant: Variant,
    onLoadMore: () => void,
  ) {
    return (
      <section className="orders-section">
        <h2>{title}</h2>
        {this.renderOrderList(orders, count, variant, onLoadMore)}
      </section>
    );
  }

  private renderLoading() {
    return (
      <div className="orders-page-loading">Bestellungen werden geladen…</div>
    );
  }

  render() {
    if (this.state.isLoading) return this.renderLoading();
    const { active, history } = splitOrdersByStatus(this.shownOrders());
    const { visibleCountActive: a, visibleCountHistory: h } = this.state;
    return (
      <div className="orders-page">
        <h1>Meine Bestellungen</h1>
        {this.renderToolbar()}
        {this.renderSection(
          "Laufende Bestellungen",
          active,
          a,
          "active",
          this.handleLoadMoreActive,
        )}
        {this.renderSection(
          "Frühere Bestellungen",
          history,
          h,
          "history",
          this.handleLoadMoreHistory,
        )}
      </div>
    );
  }
}

export default OrdersPage;
