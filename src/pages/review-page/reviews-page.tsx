import { Component } from "react";
import type { User } from "../../interface/user";
import type { Review } from "../../interface/review";
import { UserReviews } from "../../components/review/user-reviews";
import { ListToolbar } from "../../components/list-toolbar/list-toolbar";
import { getReviewsByUser } from "../../services/review-service";
import { filterReviews, sortByDate } from "../../utils/list-view";
import type { SortDirection } from "../../utils/list-view";
import { visibleItems, hasMoreItems } from "../../utils/load-more";
import "./review-page.css";

const PAGE_SIZE = 6;

/** Props accepted by {@link ReviewsPage}. */
interface ReviewsPageProps {
  /** Active user instance or `null` if unauthenticated. */
  user: User | null;
}

/** Component state for {@link ReviewsPage}. */
interface ReviewsPageState {
  /** User-submitted reviews list. */
  reviews: Review[];
  /** Pagination count for visible reviews. */
  visibleCount: number;
  /** Async fetch indicator status. */
  isLoading: boolean;
  /** Active text search query. */
  query: string;
  /** Active date sorting direction. */
  direction: SortDirection;
}

/**
 * Class component rendering user review history view with search filtering,
 * date sorting, and incremental pagination controls.
 */
export class ReviewsPage extends Component<
  ReviewsPageProps,
  ReviewsPageState
> {
  state: ReviewsPageState = {
    reviews: [],
    visibleCount: PAGE_SIZE,
    isLoading: true,
    query: "",
    direction: "desc",
  };

  componentDidMount() {
    this.loadReviews();
  }

  componentDidUpdate(prevProps: ReviewsPageProps) {
    if (prevProps.user?.id !== this.props.user?.id) this.loadReviews();
  }

  /** Loads review list submitted by the authenticated user. */
  private loadReviews = async () => {
    const { user } = this.props;
    if (!user) return this.setState({ reviews: [], isLoading: false });
    const reviews = await getReviewsByUser(user.id);
    this.setState({ reviews, isLoading: false });
  };

  /** Filters and sorts retrieved user reviews according to state settings. */
  private shownReviews(): Review[] {
    const { reviews, query, direction } = this.state;
    return sortByDate(filterReviews(reviews, query), (r) => r.date, direction);
  }

  /** Updates text query state and resets page size back to default. */
  private handleQueryChange = (query: string) => {
    this.setState({ query, visibleCount: PAGE_SIZE });
  };

  /** Updates sorting direction order. */
  private handleDirectionChange = (direction: SortDirection) => {
    this.setState({ direction });
  };

  /** Expands visible review item count by PAGE_SIZE step. */
  private loadMore = () => {
    this.setState((prev) => ({ visibleCount: prev.visibleCount + PAGE_SIZE }));
  };

  /** Renders search and sorting toolbar controls. */
  private renderToolbar() {
    const { reviews, query, direction } = this.state;
    if (!this.props.user || reviews.length === 0) return null;
    return (
      <ListToolbar
        query={query}
        direction={direction}
        onQueryChange={this.handleQueryChange}
        onDirectionChange={this.handleDirectionChange}
      />
    );
  }

  /** Renders "load more" button if additional reviews are available. */
  private renderLoadMore(shown: Review[]) {
    if (!hasMoreItems(shown, this.state.visibleCount)) return null;
    return (
      <button className="load-more-btn" onClick={this.loadMore}>
        Mehr laden
      </button>
    );
  }

  /** Renders user review list grid or empty state placeholder. */
  private renderList(user: User) {
    const shown = this.shownReviews();
    if (shown.length === 0) return this.renderEmpty();
    return (
      <>
        <UserReviews
          reviews={visibleItems(shown, this.state.visibleCount)}
          userId={user.id}
          onChanged={this.loadReviews}
        />
        {this.renderLoadMore(shown)}
      </>
    );
  }

  /** Renders empty state message based on search filter status. */
  private renderEmpty() {
    const text = this.state.query ? "Keine Treffer." : "Noch keine Bewertungen.";
    return <span className="empty-content">{text}</span>;
  }

  /** Renders main content view conditional on auth and loading state. */
  private renderContent() {
    const { user } = this.props;
    if (!user) return <p>Bitte anmelden, um deine Bewertungen zu sehen.</p>;
    if (this.state.isLoading) return <span className="empty-content">Lädt…</span>;
    return this.renderList(user);
  }

  render() {
    return (
      <div className="review-page">
        <h1 className="review-heading">Meine Bewertungen</h1>
        <div className="review-toolbar"> {this.renderToolbar()} </div>
        <div className="review-content">{this.renderContent()}</div>
      </div>
    );
  }
}

export default ReviewsPage;
