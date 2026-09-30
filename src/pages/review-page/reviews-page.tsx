import { Component } from "react";
import type { User, Review } from "../../interface/user";
import { UserReviews } from "../../components/review/user-reviews";
import { ListToolbar } from "../../components/list-toolbar/list-toolbar";
import { getReviewsByUser } from "../../services/review-service";
import { filterReviews, sortByDate } from "../../utils/list-view";
import type { SortDirection } from "../../utils/list-view";
import { visibleItems, hasMoreItems } from "../../utils/load-more";
import "./review-page.css";
 
const PAGE_SIZE = 6;
 
interface MyReviewsPageProps {
  user: User | null;
}
 
interface MyReviewsPageState {
  reviews: Review[];
  visibleCount: number;
  isLoading: boolean;
  query: string;
  direction: SortDirection;
}
 
export class MyReviewsPage extends Component<
  MyReviewsPageProps,
  MyReviewsPageState
> {
  state: MyReviewsPageState = {
    reviews: [],
    visibleCount: PAGE_SIZE,
    isLoading: true,
    query: "",
    direction: "desc",
  };
 
  componentDidMount() {
    this.loadReviews();
  }
 
  componentDidUpdate(prevProps: MyReviewsPageProps) {
    if (prevProps.user?.id !== this.props.user?.id) this.loadReviews();
  }
 
  private loadReviews = async () => {
    const { user } = this.props;
    if (!user) return this.setState({ reviews: [], isLoading: false });
    const reviews = await getReviewsByUser(user.id);
    this.setState({ reviews, isLoading: false });
  };
 
  private shownReviews(): Review[] {
    const { reviews, query, direction } = this.state;
    return sortByDate(filterReviews(reviews, query), (r) => r.date, direction);
  }
 
  private handleQueryChange = (query: string) => {
    this.setState({ query, visibleCount: PAGE_SIZE });
  };
 
  private handleDirectionChange = (direction: SortDirection) => {
    this.setState({ direction });
  };
 
  private loadMore = () => {
    this.setState((prev) => ({ visibleCount: prev.visibleCount + PAGE_SIZE }));
  };
 
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
 
  private renderLoadMore(shown: Review[]) {
    if (!hasMoreItems(shown, this.state.visibleCount)) return null;
    return (
      <button className="load-more-btn" onClick={this.loadMore}>
        Mehr laden
      </button>
    );
  }
 
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
 
  private renderEmpty() {
    const text = this.state.query ? "Keine Treffer." : "Noch keine Bewertungen.";
    return <span className="empty-content">{text}</span>;
  }
 
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
