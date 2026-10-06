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

/** Display section category variant. */
type Variant = "history" | "active";

/** Props accepted by {@link OrdersPage}. */
interface OrdersPageProps {
  /** Authenticated user profile. */
  user: User;
  /** Optional navigation callback triggered when selecting an order card. */
  onNavigateToDetail?: (orderId: string | number) => void;
}

/** Component state for {@link OrdersPage}. */
interface OrdersPageState {
  /** Complete list of user orders fetched from service. */
  orders: Order[];
  /** Flag tracking initial data fetch state. */
  isLoading: boolean;
  /** Max visible order cards in the active orders section. */
  visibleCountActive: number;
  /** Max visible order cards in the historical orders section. */
  visibleCountHistory: number;
  /** Current text filter query string. */
  query: string;
  /** Current date sorting direction (ascending/descending). */
  direction: SortDirection;
}

/**
 * Class component rendering the main orders overview page with search filtering,
 * date sorting, incremental pagination ("load more"), and separation into active vs. historical orders.
 */
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

  /** Loads order history for active user profile. */
  private async loadOrders() {
    this.setState({ isLoading: true });
    const orders = await getOrders(this.props.user);
    this.setState({ orders, isLoading: false });
  }

  /** Applies current search query filtering and date sorting rules to the orders list. */
  private shownOrders(): Order[] {
    const { orders, query, direction } = this.state;
    return sortByDate(
      filterOrders(orders, query),
      (o) => o.orderDate,
      direction,
    );
  }

  /** Updates active search query and resets incremental pagination limits. */
  private handleQueryChange = (query: string) => {
    this.setState({
      query,
      visibleCountActive: PAGE_SIZE,
      visibleCountHistory: PAGE_SIZE,
    });
  };

  /** Updates sorting direction order. */
  private handleDirectionChange = (direction: SortDirection) => {
    this.setState({ direction });
  };

  /** Increases visible item limit for active orders section. */
  private handleLoadMoreActive = () => {
    this.setState((prev) => ({
      visibleCountActive: prev.visibleCountActive + PAGE_SIZE,
    }));
  };

  /** Increases visible item limit for historical orders section. */
  private handleLoadMoreHistory = () => {
    this.setState((prev) => ({
      visibleCountHistory: prev.visibleCountHistory + PAGE_SIZE,
    }));
  };

  /** Renders search and sort toolbar if orders exist. */
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

  /** Renders grid of order cards capped by the active pagination count. */
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

  /** Renders "load more" button if additional unrendered items remain in list. */
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

  /** Renders list content grid or empty fallback message. */
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

  /** Renders contextual message when list is empty. */
  private renderEmpty() {
    const text = this.state.query
      ? "Keine Treffer."
      : "Keine Bestellungen vorhanden.";
    return <span className="empty-content">{text}</span>;
  }

  /** Renders a titled section containing an order list group. */
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

  /** Renders loading state indicator. */
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
