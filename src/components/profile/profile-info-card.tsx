import { Component } from "react";
import type { Delivery } from "../../interface/user";
import "../../pages/profile-page/profile.css";

/** Props for the ProfileInfoCard class component. */
interface ProfileInfoCardProps {
  /** User's first name. */
  firstname: string;
  /** User's last name. */
  lastname: string;
  /** User's email address. */
  email: string;
  /** Billing street address. */
  street: string;
  /** Billing postal code. */
  zip: string;
  /** Billing city. */
  city: string;
  /** Billing country. */
  country: string;
  /** Optional separate shipping/delivery address data. */
  delivery?: Delivery;
  /** Whether the card is currently in editable input mode. */
  isEditing: boolean;
  /** Callback triggered to toggle edit mode. */
  onEditToggle: () => void;
  /** Callback fired when an input field value changes. */
  onFieldChange: (field: string, value: string) => void;
  /** Callback fired when the user saves profile modifications. */
  onSave: () => void;
}

/** Input validation and HTML attribute constraints for form fields. */
interface FieldOptions {
  /** Standard HTML input type string. */
  type?: string;
  /** Virtual keyboard hints for mobile devices. */
  inputMode?: "text" | "numeric" | "email" | "tel";
  /** Maximum character length constraint. */
  maxLength?: number;
  /** Restricts text input strictly to numeric digits. */
  onlyNumbers?: boolean;
}

/**
 * Class component displaying and editing personal details, billing, and shipping addresses.
 */
export class ProfileInfoCard extends Component<ProfileInfoCardProps> {
  /**
   * Generates a change handler that updates state and optionally sanitizes numeric input.
   *
   * @param field - Key name of the target field.
   * @param options - Validation constraints such as `onlyNumbers`.
   */
  private handleChange = (field: string, options?: FieldOptions) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (options?.onlyNumbers) {
        value = value.replace(/\D/g, "");
      }
      this.props.onFieldChange(field, value);
    };
  };

  /** Renders either plain text or an interactive text input based on `isEditing`. */
  private renderField(field: string, value: string, placeholder?: string, options?: FieldOptions) {
    const { isEditing } = this.props;
    if (!isEditing) return <span title={value}>{value}</span>;

    return (
      <input
        className="profile-input"
        type={options?.type || "text"}
        inputMode={options?.inputMode}
        maxLength={options?.maxLength}
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange(field, options)}
      />
    );
  }

  /** Renders personal user information including icon, full name, and email address. */
  private renderPersonalInfo() {
    const { firstname, lastname, email } = this.props;
    return (
      <div className="profile-info-name">
        <img
          className="account-icon"
          src="./assets/icons/profil.png"
          alt="Account Icon"
        />
        <div className="profile-name-row">
          {this.renderField("firstname", firstname, "Vorname")}
          {this.renderField("lastname", lastname, "Nachname")}
        </div>
        {this.renderField("email", email, "E-Mail", {
          type: "email",
          inputMode: "email",
        })}
      </div>
    );
  }

  /** Renders billing address section or empty state message. */
  private renderBillingAddress() {
    const { street, zip, city, country, isEditing } = this.props;
    const hasBillingAddress = street || zip || city || country;
    if (!hasBillingAddress && !isEditing) return this.renderNoBillingAddress();
    return this.renderBillingAddressFields();
  }

  /** Renders a message when no billing address is set. */
  private renderNoBillingAddress() {
    return (
      <div className="profile-sub-block">
        <p className="profile-column-title">Rechnungsadresse:</p>
        <span className="no-address">Keine Rechnungsadresse hinterlegt</span>
      </div>
    );
  }

  /** Renders editable or formatted billing address fields. */
  private renderBillingAddressFields() {
    const { street, zip, city, country } = this.props;
    return (
      <div className="profile-sub-block">
        <p className="profile-column-title">Rechnungsadresse:</p>
        {this.renderField("billingStreet", street, "Straße Hausnummer")}
        <div className="profile-name-row">
          {this.renderField("billingZip", zip, "PLZ", {
            onlyNumbers: true, maxLength: 5, inputMode: "numeric",})}
          {this.renderField("billingCity", city, "Stadt")}
        </div>
        {this.renderField("billingCountry", country, "Land")}
      </div>
    );
  }

  /** Renders delivery address section or empty state message. */
  private renderDeliveryAddress() {
    const { delivery, isEditing } = this.props;
    if (!delivery && !isEditing) return this.renderNoDelivery();
    return this.renderDeliveryFields();
  }

  /** Renders a message when no delivery address is set. */
  private renderNoDelivery() {
    return (
      <div className="profile-info-column">
        <p className="profile-column-title">Lieferadresse:</p>
        <span className="no-address">Keine Lieferadresse hinterlegt</span>
      </div>
    );
  }

  /** Renders delivery address section fields. */
  private renderDeliveryFields() {
    return (
      <div className="profile-info-column">
        <p className="profile-column-title">Lieferadresse:</p>
        {this.renderDeliveryName()}
        {this.renderDeliveryLocation()}
      </div>
    );
  }

  /** Renders recipient name input fields for delivery. */
  private renderDeliveryName() {
    const { delivery } = this.props;
    return (
      <div className="profile-name-row">
        {this.renderField("deliveryFirstname", delivery?.Firstname ?? "", "Vorname")}
        {this.renderField("deliveryLastname", delivery?.Lastname ?? "", "Nachname")}
      </div>
    );
  }

  /** Renders location and address fields for delivery. */
  private renderDeliveryLocation() {
    const { delivery } = this.props;
    return (
      <>
        {this.renderField("deliveryStreet", delivery?.street ?? "", "Straße Hausnummer")}
        <div className="profile-name-row">
          {this.renderField("deliveryZip", delivery?.zip ?? "", "PLZ", {
            onlyNumbers: true, maxLength: 5, inputMode: "numeric",})}
          {this.renderField("deliveryCity", delivery?.city ?? "", "Stadt")}
        </div>
        {this.renderField("deliveryCountry", delivery?.country ?? "", "Land")}
      </>
    );
  }

  /** Renders top-corner edit toggle button. */
  private renderEditIcon() {
    return (
      <button
        className="profile-edit-icon"
        aria-label="Profil bearbeiten"
        onClick={this.props.onEditToggle}
      >
        <img src="./assets/icons/edit.png" alt="Edit" />
      </button>
    );
  }

  render() {
    const { isEditing, onSave } = this.props;
    return (
      <div className="profile-info-card-container">
        {this.renderEditIcon()}
        <div className="profile-info-grid">
          {this.renderPersonalInfo()}
          <div className="profil-adresse">
            {this.renderBillingAddress()}
            {this.renderDeliveryAddress()}
          </div>
        </div>
        {isEditing && (
          <button className="profile-save-btn" onClick={onSave}>
            Speichern
          </button>
        )}
      </div>
    );
  }
}