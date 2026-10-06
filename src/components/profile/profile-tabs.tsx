import { Component } from "react";

/** Union of valid tab keys for the profile navigation bar. */
export type ProfileTabKey = "reviews" | "orderHistory" | "activeOrders";

/** Tab item configuration descriptor. */
interface Tab {
  /** Unique key identifying the tab. */
  key: ProfileTabKey;
  /** Display label shown on the tab button. */
  label: string;
}

/** Props for the ProfileTabs component. */
interface ProfileTabsProps {
  /** Currently selected active tab key. */
  activeTab: ProfileTabKey;
  /** Callback fired when a tab selection changes. */
  onTabChange: (tab: ProfileTabKey) => void;
}

const TABS: Tab[] = [
  { key: "reviews", label: "Bewertungen" },
  { key: "orderHistory", label: "Bestellverlauf" },
  { key: "activeOrders", label: "Laufende Bestellungen" },
];

/**
 * Class component rendering a tab bar for switching views on the profile page.
 */
export class ProfileTabs extends Component<ProfileTabsProps> {
  /** Renders an individual tab button. */
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
