import { Component } from "react";
import type { User } from "../../interface/user";
import type { Order } from "../../interface/order";
import type { Review } from "../../interface/review";
import type { ProfileTabKey } from "../../components/profile/profile-tabs";
import { ProfileInfoCard } from "../../components/profile/profile-info-card";
import { DeleteConfirmModal } from "../../components/profile/delete-confirm-modal";
import { CancelOrderModal } from "../../components/order/cancel-order-modal";
import { ProfileTabs } from "../../components/profile/profile-tabs";
import { OrderCard } from "../../components/order/order-card";
import { getOrders, splitOrdersByStatus, cancelOrder } from "../../services/order-service";
import { UserReviews } from "../../components/review/user-reviews";
import { getReviewsByUser } from "../../services/review-service";
import {
  mergedValue,
  mergedDelivery,
  buildUserUpdate,
} from "../../services/user-service";
import { visibleItems, hasMoreItems } from "../../utils/load-more";
import "./profile.css";

const PAGE_SIZE = 4;

interface ProfileProps {
  user: User;
  onSave: (updated: Partial<User>) => void;
  onDeleteAccount: () => void;
  onNavigateToDetail: (orderId: string | number) => void;
}

interface ProfileState {
  isEditing: boolean;
  showDeleteConfirm: boolean;
  cancellingOrderId: string | number | null;
  activeTab: ProfileTabKey;
  formData: Record<string, string>;
  visibleCount: Record<ProfileTabKey, number>;
  orders: Order[];
  reviews: Review[];
  isLoading: boolean;
}

export class Profile extends Component<ProfileProps, ProfileState> {
  state: ProfileState = {
    isEditing: false,
    showDeleteConfirm: false,
    cancellingOrderId: null,
    activeTab: "reviews",
    formData: {},
    visibleCount: {
      reviews: PAGE_SIZE,
      orderHistory: PAGE_SIZE,
      activeOrders: PAGE_SIZE,
    },
    orders: [],
    reviews: [],
    isLoading: true,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: ProfileProps) {
    if (prevProps.user !== this.props.user) this.loadData();
  }

  private async loadData() {
    this.setState({ isLoading: true });
    const { user } = this.props;
    const [orders, reviews] = await Promise.all([
      getOrders(user),
      getReviewsByUser(user.id),
    ]);
    this.setState({ orders, reviews, isLoading: false });
  }

  private reloadReviews = async () => {
    const reviews = await getReviewsByUser(this.props.user.id);
    this.setState({ reviews });
  };

  private renderReviews() {
    const { reviews, visibleCount } = this.state;
    return (
      <>
        <UserReviews
          reviews={visibleItems(reviews, visibleCount.reviews)}
          userId={this.props.user.id}
          onChanged={this.reloadReviews}
        />
        {this.renderLoadMore("reviews", reviews, visibleCount.reviews)}
      </>
    );
  }

  private toggleEdit = () => {
    this.setState((prev) => ({ isEditing: !prev.isEditing, formData: {} }));
  };

  private handleFieldChange = (field: string, value: string) => {
    this.setState((prev) => ({
      formData: { ...prev.formData, [field]: value },
    }));
  };

  private handleSave = () => {
    const { user, onSave } = this.props;
    onSave(buildUserUpdate(user, this.state.formData));
    this.setState({ isEditing: false, formData: {} });
  };

  private setActiveTab = (tab: ProfileTabKey) => {
    this.setState({ activeTab: tab });
  };

  private loadMore = (tab: ProfileTabKey) => {
    this.setState((prev) => ({
      visibleCount: {
        ...prev.visibleCount,
        [tab]: prev.visibleCount[tab] + PAGE_SIZE,
      },
    }));
  };

  private renderInfoCard() {
    const { user } = this.props;
    const { formData, isEditing } = this.state;
    return (
      <ProfileInfoCard
        firstname={mergedValue(formData, "firstname", user.Firstname)}
        lastname={mergedValue(formData, "lastname", user.Lastname)}
        email={mergedValue(formData, "email", user.email)}
        street={mergedValue(formData, "billingStreet", user.street ?? "")}
        zip={mergedValue(formData, "billingZip", user.zip ?? "")}
        city={mergedValue(formData, "billingCity", user.city ?? "")}
        country={mergedValue(formData, "billingCountry", user.country ?? "")}
        delivery={mergedDelivery(user.deliveryAddress?.[0], formData)}
        isEditing={isEditing}
        onEditToggle={this.toggleEdit}
        onFieldChange={this.handleFieldChange}
        onSave={this.handleSave}
      />
    );
  }

  private renderOrders(variant: "history" | "active") {
    const { history, active } = splitOrdersByStatus(this.state.orders);
    const orders = variant === "history" ? history : active;
    const tab: ProfileTabKey =
      variant === "history" ? "orderHistory" : "activeOrders";
    return this.renderOrderGrid(
      orders,
      this.state.visibleCount[tab],
      variant,
      tab,
    );
  }

  private handleOpenCancelModal = (orderId: string | number) => {
    this.setState({ cancellingOrderId: orderId });
  };

  private handleConfirmCancel = async () => {
    const { cancellingOrderId } = this.state;
    if (!cancellingOrderId) return;

    await cancelOrder(this.props.user, cancellingOrderId);
    const orders = await getOrders(this.props.user);

    this.setState({
      orders,
      cancellingOrderId: null,
    });
  };

  private handleCloseCancelModal = () => {
    this.setState({ cancellingOrderId: null });
  };

  private renderOrderGrid(
    orders: Order[],
    count: number,
    variant: "history" | "active",
    tab: ProfileTabKey,
  ) {
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
              onCancelClick={variant === "active" ? this.handleOpenCancelModal : undefined}
            />
          ))}
        </div>
        {this.renderLoadMore(tab, orders, count)}
      </>
    );
  }

  private renderLoadMore<T>(tab: ProfileTabKey, items: T[], count: number) {
    if (items.length === 0)
      return <span className="empty-content">Keine Vorhanden</span>;
    if (!hasMoreItems(items, count)) return null;
    return (
      <button className="load-more-btn" onClick={() => this.loadMore(tab)}>
        Mehr laden
      </button>
    );
  }

  private renderTabContent() {
    if (this.state.isLoading)
      return <span className="empty-content">Lädt…</span>;
    const { activeTab } = this.state;
    if (activeTab === "reviews") return this.renderReviews();
    if (activeTab === "orderHistory") return this.renderOrders("history");
    return this.renderOrders("active");
  }

  render() {
    const { showDeleteConfirm, cancellingOrderId } = this.state;

    return (
      <div className="profile-page">
        <h1 className="profile-heading">Profil</h1>
        {this.renderInfoCard()}
        <button
          className="profile-delete-btn"
          onClick={() => this.setState({ showDeleteConfirm: true })}
        >
          Profil löschen
        </button>
        <ProfileTabs
          activeTab={this.state.activeTab}
          onTabChange={this.setActiveTab}
        />
        <div className="profile-tab-content">{this.renderTabContent()}</div>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={this.props.onDeleteAccount}
            onCancel={() => this.setState({ showDeleteConfirm: false })}
          />
        )}
        {cancellingOrderId !== null && (
          <CancelOrderModal
            orderId={cancellingOrderId}
            onConfirm={this.handleConfirmCancel}
            onCancel={this.handleCloseCancelModal}
          />
        )}
      </div>
    );
  }
}

export default Profile;