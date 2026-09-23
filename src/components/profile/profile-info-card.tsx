import { Component } from "react";
import type { Delivery } from "../../interface/user";

interface ProfileInfoCardProps {
  firstname: string;
  lastname: string;
  email: string;
  street: string;
  zip: string;
  country: string;
  delivery?: Delivery;
  isEditing: boolean;
  onEditToggle: () => void;
  onFieldChange: (field: string, value: string) => void;
  onSave: () => void;
}

export class ProfileInfoCard extends Component<ProfileInfoCardProps> {
  private handleChange = (field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onFieldChange(field, e.target.value);
    };
  };

  private renderField(field: string, value: string, placeholder?: string) {
    const { isEditing } = this.props;
    if (!isEditing) return <span>{value}</span>;
    return (
      <input
        className="profile-input"
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange(field)}
      />
    );
  }

  private renderPersonalInfo() {
    const { firstname, lastname, email } = this.props;
    return (
      <div className="profile-info-column">
        <div className="profile-name-row">
          {this.renderField("firstname", firstname)}
          {this.renderField("lastname", lastname)}
        </div>
        {this.renderField("email", email)}
        {this.renderBillingAddress()}
      </div>
    );
  }

  private renderBillingAddress() {
    const { street, zip, country, isEditing } = this.props;
    const hasBillingAddress = street || zip || country;
    if (!hasBillingAddress && !isEditing) return this.renderNoBillingAddress();
    return this.renderBillingAddressFields();
  }

  private renderNoBillingAddress() {
    return (
      <div className="profile-sub-block">
        <p className="profile-column-title">Rechnungsadresse:</p>
        <span>Keine Rechnungsadresse hinterlegt</span>
      </div>
    );
  }

  private renderBillingAddressFields() {
    const { street, zip, country } = this.props;
    return (
      <div className="profile-sub-block">
        <p className="profile-column-title">Rechnungsadresse:</p>
        {this.renderField("billingStreet", street, "Straße Hausnummer")}
        {this.renderField("billingZip", zip, "PLZ")}
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
        <span>Keine Lieferadresse hinterlegt</span>
      </div>
    );
  }

  private renderDeliveryFields() {
    const { delivery } = this.props;
    return (
      <div className="profile-info-column">
        <p className="profile-column-title">Lieferadresse:</p>
        <div className="profile-name-row">
          {this.renderField("deliveryFirstname", delivery?.Firstname ?? "", "Vorname")}
          {this.renderField("deliveryLastname", delivery?.Lastname ?? "", "Nachname")}
        </div>
        {this.renderField("deliveryStreet", delivery?.street ?? "", "Straße Hausnummer")}
        {this.renderField("deliveryZip", delivery?.zip ?? "", "PLZ")}
        {this.renderField("deliveryCountry", delivery?.country ?? "", "Land")}
      </div>
    );
  }

  private renderEditIcon() {
    return (
      <button
        className="profile-edit-icon"
        aria-label="Profil bearbeiten"
        onClick={this.props.onEditToggle}
      >
        <img src="/assets/icons/edit.png" alt="Edit"/>
      </button>
    );
  }

  render() {
    const { isEditing, onSave } = this.props;
    return (
      <div className="profile-info-card">
        {this.renderEditIcon()}
        <div className="profile-info-grid">
          {this.renderPersonalInfo()}
          {this.renderDeliveryAddress()}
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