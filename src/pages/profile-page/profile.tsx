import { Component } from "react";
import type { User, Delivery } from "../../interface/user";
import type { ProfileTabKey } from "../../components/profile/profile-tabs";
import { ProfileInfoCard } from "../../components/profile/profile-info-card";
import { DeleteConfirmModal } from "../../components/profile/delete-confirm-modal";
import { ProfileTabs } from "../../components/profile/profile-tabs";
import { ReviewListItem } from "../../components/profile/review-list-item";
import { OrderCard } from "../../components/profile/order-card";
import "./profile.css";

const PAGE_SIZE = 4;

interface ProfileProps {
  user: User;
  onSave: (updated: Partial<User>) => void;
  onDeleteAccount: () => void;
}

interface ProfileState {
  isEditing: boolean;
  showDeleteConfirm: boolean;
  activeTab: ProfileTabKey;
  formData: Record<string, string>;
  visibleCount: Record<ProfileTabKey, number>;
}

export class Profile extends Component<ProfileProps, ProfileState> {
  state: ProfileState = {
    isEditing: false,
    showDeleteConfirm: false,
    activeTab: "reviews",
    formData: {},
    visibleCount: {
      reviews: PAGE_SIZE,
      orderHistory: PAGE_SIZE,
      activeOrders: PAGE_SIZE,
    },
  };

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
    onSave({
      Firstname: this.mergedValue("firstname", user.Firstname),
      Lastname: this.mergedValue("lastname", user.Lastname),
      email: this.mergedValue("email", user.email),
      street: this.mergedValue("billingStreet", user.street ?? ""),
      zip: this.mergedValue("billingZip", user.zip ?? ""),
      country: this.mergedValue("billingCountry", user.country ?? ""),
      deliveryAddress: this.buildDeliveryList(user),
    });
    this.setState({ isEditing: false, formData: {} });
  };

  private buildDeliveryList(user: User): Delivery[] | undefined {
    const primary = user.deliveryAddress?.[0];
    const rest = (user.deliveryAddress ?? []).slice(1);
    const updated = this.mergedDelivery(primary);
    return updated ? [updated, ...rest] : user.deliveryAddress;
  }

  private mergedDelivery(primary?: Delivery): Delivery | undefined {
    const { deliveryStreet, deliveryZip, deliveryCountry } =
      this.state.formData;
    if (!primary && !deliveryStreet && !deliveryZip && !deliveryCountry)
      return undefined;
    return {
      id: primary?.id ?? Date.now(),
      Firstname: this.mergedValue(
        "deliveryFirstname",
        primary?.Firstname ?? "",
      ),
      Lastname: this.mergedValue("deliveryLastname", primary?.Lastname ?? ""),
      street: this.mergedValue("deliveryStreet", primary?.street ?? ""),
      zip: this.mergedValue("deliveryZip", primary?.zip ?? ""),
      country: this.mergedValue("deliveryCountry", primary?.country ?? ""),
    };
  }

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

  private mergedValue(field: string, fallback: string) {
    return this.state.formData[field] ?? fallback;
  }

  private renderInfoCard() {
    const { user } = this.props;
    const primary = user.deliveryAddress?.[0];
    return (
      <ProfileInfoCard
        firstname={this.mergedValue("firstname", user.Firstname)}
        lastname={this.mergedValue("lastname", user.Lastname)}
        email={this.mergedValue("email", user.email)}
        street={this.mergedValue("billingStreet", user.street ?? "")}
        zip={this.mergedValue("billingZip", user.zip ?? "")}
        country={this.mergedValue("billingCountry", user.country ?? "")}
        delivery={this.mergedDelivery(primary)}
        isEditing={this.state.isEditing}
        onEditToggle={this.toggleEdit}
        onFieldChange={this.handleFieldChange}
        onSave={this.handleSave}
      />
    );
  }

  private renderReviews() {
    const reviews = this.props.user.reviews ?? [];
    const count = this.state.visibleCount.reviews;
    const items = reviews.slice(0, count);
    return (
      <>
        {items.map((r) => (
          <ReviewListItem key={r.id} review={r} />
        ))}
        {this.renderLoadMore("reviews", reviews.length, count)}
      </>
    );
  }

  private renderOrders(variant: "history" | "active") {
    const orders = this.props.user.order ?? [];
    const tab: ProfileTabKey =
      variant === "history" ? "orderHistory" : "activeOrders";
    const filtered = orders.filter((o) =>
      variant === "history"
        ? o.status === "delivered"
        : o.status !== "delivered",
    );
    const count = this.state.visibleCount[tab];
    return this.renderOrderGrid(filtered, count, variant, tab);
  }

  private renderOrderGrid(
    orders: NonNullable<User["order"]>,
    count: number,
    variant: "history" | "active",
    tab: ProfileTabKey,
  ) {
    const items = orders.slice(0, count);
    return (
      <>
        <div className="order-grid">
          {items.map((o) => (
            <OrderCard key={o.id} order={o} variant={variant} />
          ))}
        </div>
        {this.renderLoadMore(tab, orders.length, count)}
      </>
    );
  }

  private renderLoadMore(tab: ProfileTabKey, total: number, count: number) {
    if (total == 0) return <span className="empty-content">Keine Vorhanden</span>;
    if (count >= total) return null
    return (
      <button className="load-more-btn" onClick={() => this.loadMore(tab)}>
        Mehr laden
      </button>
    );
  }

  private renderTabContent() {
    const { activeTab } = this.state;
    if (activeTab === "reviews") return this.renderReviews();
    if (activeTab === "orderHistory") return this.renderOrders("history");
    return this.renderOrders("active");
  }

  render() {
    const { showDeleteConfirm } = this.state;
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
      </div>
    );
  }
}
