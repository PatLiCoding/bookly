import { Component } from "react";

export type ProfileTabKey = "reviews" | "orderHistory" | "activeOrders";

interface Tab {
  key: ProfileTabKey;
  label: string;
}

interface ProfileTabsProps {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
}

const TABS: Tab[] = [
  { key: "reviews", label: "Bewertungen" },
  { key: "orderHistory", label: "Bestellverlauf" },
  { key: "activeOrders", label: "Laufende Bestellungen" },
];

export class ProfileTabs extends Component<ProfileTabsProps> {
  private renderTab = (tab: Tab) => {
    const { activeTab, onTabChange } = this.props;
    const isActive = tab.key === activeTab;
    return (
      <button
        key={tab.key}
        className={`profile-tab ${isActive ? "profile-tab-active" : ""}`}
        onClick={() => onTabChange(tab.key)}
      >
        {tab.label}
      </button>
    );
  };

  render() {
    return <div className="profile-tabs">{TABS.map(this.renderTab)}</div>;
  }
}
