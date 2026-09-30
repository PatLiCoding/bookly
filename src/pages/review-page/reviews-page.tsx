import { Component } from "react";
import type { User, Review } from "../../interface/user";
import { UserReviews } from "../../components/review/user-reviews";
import { getReviewsByUser } from "../../services/review-service";
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
}
 
export class MyReviewsPage extends Component<
  MyReviewsPageProps,
  MyReviewsPageState
> {
  state: MyReviewsPageState = {
    reviews: [],
    visibleCount: PAGE_SIZE,
    isLoading: true,
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
 
  private loadMore = () => {
    this.setState((prev) => ({ visibleCount: prev.visibleCount + PAGE_SIZE }));
  };
 
  private renderLoadMore() {
    const { reviews, visibleCount } = this.state;
    if (!hasMoreItems(reviews, visibleCount)) return null;
    return (
      <button className="load-more-btn" onClick={this.loadMore}>
        Mehr laden
      </button>
    );
  }
 
  private renderList(user: User) {
    const { reviews, visibleCount } = this.state;
    if (reviews.length === 0)
      return <span className="empty-content">Noch keine Bewertungen.</span>;
    return (
      <>
        <UserReviews
          reviews={visibleItems(reviews, visibleCount)}
          userId={user.id}
          onChanged={this.loadReviews}
        />
        {this.renderLoadMore()}
      </>
    );
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
        <div className="review-content">{this.renderContent()}</div>
      </div>
    );
  }
}
