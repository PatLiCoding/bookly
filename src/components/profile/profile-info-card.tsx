import { Component } from "react";
import type { Delivery } from "../../interface/user";
import "../../pages/profile-page/profile.css";

interface ProfileInfoCardProps {
  firstname: string;
  lastname: string;
  email: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  delivery?: Delivery;
  isEditing: boolean;
  onEditToggle: () => void;
  onFieldChange: (field: string, value: string) => void;
  onSave: () => void;
}

interface FieldOptions {
  type?: string;
  inputMode?: "text" | "numeric" | "email" | "tel";
  maxLength?: number;
  onlyNumbers?: boolean;
}

export class ProfileInfoCard extends Component<ProfileInfoCardProps> {
  private handleChange = (field: string, options?: FieldOptions) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (options?.onlyNumbers) {
        value = value.replace(/\D/g, "");
      }
      this.props.onFieldChange(field, value);
    };
  };

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

  private renderBillingAddress() {
    const { street, zip, city, country, isEditing } = this.props;
    const hasBillingAddress = street || zip || city || country;
    if (!hasBillingAddress && !isEditing) return this.renderNoBillingAddress();
    return this.renderBillingAddressFields();
  }

  private renderNoBillingAddress() {
    return (
      <div className="profile-sub-block">
        <p className="profile-column-title">Rechnungsadresse:</p>
        <span className="no-address">Keine Rechnungsadresse hinterlegt</span>
      </div>
    );
  }

  private renderBillingAddressFields() {
    const { street, zip, city, country } = this.props;
    return (
      <div className="profile-sub-block">
        <p className="profile-column-title">Rechnungsadresse:</p>
        {this.renderField("billingStreet", street, "Straße Hausnummer")}
        <div className="profile-name-row">
          {this.renderField("billingZip", zip, "PLZ", {
            onlyNumbers: true,
            maxLength: 5,
            inputMode: "numeric",
          })}
          {this.renderField("billingCity", city, "Stadt")}
        </div>
        {this.renderField("billingCountry", country, "Land")}
      </div>
    );
  }

  private renderDeliveryAddress() {
    const { delivery, isEditing } = this.props;
    if (!delivery && !isEditing) return this.renderNoDelivery();
    return this.renderDeliveryFields();
  }

  private renderNoDelivery() {
    return (
      <div className="profile-info-column">
        <p className="profile-column-title">Lieferadresse:</p>
        <span className="no-address">Keine Lieferadresse hinterlegt</span>
      </div>
    );
  }

  private renderDeliveryFields() {
    return (
      <div className="profile-info-column">
        <p className="profile-column-title">Lieferadresse:</p>
        {this.renderDeliveryName()}
        {this.renderDeliveryLocation()}
      </div>
    );
  }

  private renderDeliveryName() {
    const { delivery } = this.props;
    return (
      <div className="profile-name-row">
        {this.renderField("deliveryFirstname", delivery?.Firstname ?? "", "Vorname")}
        {this.renderField("deliveryLastname", delivery?.Lastname ?? "", "Nachname" )}
      </div>
    );
  }

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