import { Component, type ChangeEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import type { Order, User, Delivery } from "../../interface/user";
import type { CartItem } from "../cart-page/cart-page";
import { buildUserUpdate } from "../../services/user-service";
import "./checkout-page.css";

interface CheckoutPageProps {
  cartItems: CartItem[];
  loggedUser: User | null;
  onUpdateUser: (user: User) => void;
  onOrderComplete: () => void;
}

interface CheckoutState {
  agbAccepted: boolean;
  ordered: boolean;
  errorMsg: string;
  shipping: Delivery;
  billing: AddressData;
}

interface AddressData {
  name: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}

export class CheckoutPage extends Component<CheckoutPageProps, CheckoutState> {
  constructor(props: CheckoutPageProps) {
    super(props);
    this.state = {
      agbAccepted: false,
      ordered: false,
      errorMsg: "",
      shipping: CheckoutPage.buildInitialShipping(props.loggedUser),
      billing: CheckoutPage.buildInitialBilling(props.loggedUser),
    };
  }

  private static buildInitialShipping(user: User | null): Delivery {
    const delivery = user?.deliveryAddress?.[0];
    return {
      id: delivery?.id ?? Date.now(),
      Firstname: delivery?.Firstname ?? user?.Firstname ?? "",
      Lastname: delivery?.Lastname ?? user?.Lastname ?? "",
      street: delivery?.street ?? "",
      zip: delivery?.zip ?? "",
      city: delivery?.city ?? "",
      country: delivery?.country ?? user?.country ?? "Deutschland",
    };
  }

  private static buildInitialBilling(user: User | null): AddressData {
    return {
      name: `${user?.Firstname ?? ""} ${user?.Lastname ?? ""}`.trim(),
      street: user?.street ?? "",
      zip: user?.zip ?? "",
      city: user?.city ?? "",
      country: user?.country ?? "Deutschland",
    };
  }

  get subtotal(): number {
    return this.props.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get shippingCost(): number {
    return this.props.cartItems.length > 0 ? 3.95 : 0;
  }

  get totalPrice(): number {
    return this.subtotal + this.shippingCost;
  }

  get deliveryDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("de-DE");
  }

  formatPrice(value: number): string {
    return `${value.toFixed(2).replace(".", ",")} €`;
  }

  updateShipping(field: keyof Delivery, value: string): void {
    this.setState((prev) => ({ shipping: { ...prev.shipping, [field]: value } }));
  }

  updateBilling(field: keyof AddressData, value: string): void {
    this.setState((prev) => ({ billing: { ...prev.billing, [field]: value } }));
  }

  private isShippingValid(): boolean {
    const { shipping } = this.state;
    return Boolean(
      shipping.Firstname && shipping.Lastname && shipping.street && shipping.zip && shipping.city,
    );
  }

  private isBillingValid(): boolean {
    const { billing } = this.state;
    return Boolean(billing.name && billing.street && billing.zip && billing.city);
  }

  isAddressValid(): boolean {
    return this.isShippingValid() && this.isBillingValid();
  }

  private mapOrderItems() {
    return this.props.cartItems.map((item) => ({
      id: item.id,
      bookCover: item.cover ?? "/assets/img/bookcover_default.png",
      title: item.title,
      author: item.author,
      price: item.price * item.quantity,
      quantity: item.quantity,
    }));
  }

  createOrder(): Order {
    return {
      id: Date.now(),
      items: this.mapOrderItems(),
      totalPrice: this.totalPrice,
      orderDate: new Date().toISOString().split("T")[0],
      status: "processing",
    };
  }

  private getValidationError(): string {
    if (!this.isAddressValid()) return "Bitte fülle alle Adressfelder aus.";
    if (!this.state.agbAccepted) return "Bitte stimme den AGB zu.";
    return "";
  }

  private billingFormFields(): Record<string, string> {
    const { billing } = this.state;
    return {
      billingStreet: billing.street,
      billingZip: billing.zip,
      billingCity: billing.city,
      billingCountry: billing.country,
    };
  }

  private shippingFormFields(): Record<string, string> {
    const { shipping } = this.state;
    return {
      deliveryFirstname: shipping.Firstname,
      deliveryLastname: shipping.Lastname,
      deliveryStreet: shipping.street,
      deliveryZip: shipping.zip,
      deliveryCity: shipping.city,
      deliveryCountry: shipping.country,
    };
  }

  private toFormData(): Record<string, string> {
    return { ...this.billingFormFields(), ...this.shippingFormFields() };
  }

  private buildUpdatedUser(user: User, order: Order): User {
    return {
      ...user,
      ...buildUserUpdate(user, this.toFormData()),
      order: [...(user.order ?? []), order],
    };
  }

  handleOrder = (): void => {
    const error = this.getValidationError();
    if (error) {
      this.setState({ errorMsg: error });
      return;
    }
    const user = this.props.loggedUser;
    if (!user) return;
    const order = this.createOrder();
    this.props.onUpdateUser(this.buildUpdatedUser(user, order));
    this.props.onOrderComplete();
    this.setState({ errorMsg: "", ordered: true });
  };

  private renderInput(label: string, value: string, onChange: (value: string) => void) {
    return (
      <label className="checkout-field">
        <span>{label}</span>
        <input
          type="text"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
      </label>
    );
  }

  private renderBillingMainFields() {
    const { billing } = this.state;
    return (
      <>
        {this.renderInput("Name", billing.name, (v) => this.updateBilling("name", v))}
        {this.renderInput("Straße & Hausnummer", billing.street, (v) => this.updateBilling("street", v))}
      </>
    );
  }

  private renderBillingLocationFields() {
    const { billing } = this.state;
    return (
      <div className="checkout-field-row">
        {this.renderInput("PLZ", billing.zip, (v) => this.updateBilling("zip", v))}
        {this.renderInput("Ort", billing.city, (v) => this.updateBilling("city", v))}
      </div>
    );
  }

  private renderBillingAddress() {
    const { billing } = this.state;
    return (
      <div className="checkout-card">
        <h3>Rechnungsadresse</h3>
        {this.renderBillingMainFields()}
        {this.renderBillingLocationFields()}
        {this.renderInput("Land", billing.country, (v) => this.updateBilling("country", v))}
      </div>
    );
  }

  private renderShippingNameFields() {
    const { shipping } = this.state;
    return (
      <div className="checkout-field-row">
        {this.renderInput("Vorname", shipping.Firstname, (v) => this.updateShipping("Firstname", v))}
        {this.renderInput("Nachname", shipping.Lastname, (v) => this.updateShipping("Lastname", v))}
      </div>
    );
  }

  private renderShippingLocationFields() {
    const { shipping } = this.state;
    return (
      <div className="checkout-field-row">
        {this.renderInput("PLZ", shipping.zip, (v) => this.updateShipping("zip", v))}
        {this.renderInput("Ort", shipping.city, (v) => this.updateShipping("city", v))}
      </div>
    );
  }

  private renderShippingAddress() {
    const { shipping } = this.state;
    return (
      <div className="checkout-card">
        <h3>Lieferadresse</h3>
        {this.renderShippingNameFields()}
        {this.renderInput("Straße & Hausnummer", shipping.street, (v) => this.updateShipping("street", v))}
        {this.renderShippingLocationFields()}
        {this.renderInput("Land", shipping.country, (v) => this.updateShipping("country", v))}
      </div>
    );
  }

  private renderAddresses() {
    return (
      <div className="checkout-addresses">
        {this.renderBillingAddress()}
        {this.renderShippingAddress()}
      </div>
    );
  }

  private renderItemRow(item: CartItem) {
    return (
      <div className="checkout-item" key={item.id}>
        <div>
          <strong>{item.title}</strong> <span>{item.author}</span>
          <small>Menge: {item.quantity}</small>
        </div>
        <strong>{this.formatPrice(item.price * item.quantity)}</strong>
      </div>
    );
  }

  private renderItems() {
    return (
      <div className="checkout-card">
        <h3>Lieferumfang</h3>
        <div className="checkout-items">
          {this.props.cartItems.map((item) => this.renderItemRow(item))}
        </div>
        <div className="checkout-total">
          <span>Gesamtsumme inkl. Versand</span>
          <strong>{this.formatPrice(this.totalPrice)}</strong>
        </div>
      </div>
    );
  }

  private renderSummaryRow(label: string, value: string, isTotal = false) {
    return (
      <div className={isTotal ? "checkout-summary-total" : undefined}>
        {isTotal ? <strong>{label}</strong> : <span>{label}</span>}
        {isTotal ? <strong>{value}</strong> : <span>{value}</span>}
      </div>
    );
  }

  private renderSummary() {
    return (
      <div className="checkout-card checkout-summary">
        {this.renderSummaryRow("Zwischensumme", this.formatPrice(this.subtotal))}
        {this.renderSummaryRow("Versand", this.formatPrice(this.shippingCost))}
        {this.renderSummaryRow("Gesamtsumme", this.formatPrice(this.totalPrice), true)}
      </div>
    );
  }

  private renderConfirmationActions() {
    return (
      <div className="checkout-confirmation-actions">
        <Link to="/order" className="checkout-confirmation-btn checkout-confirmation-btn--primary">
          Zu meinen Bestellungen
        </Link>
        <Link to="/" className="checkout-confirmation-btn checkout-confirmation-btn--secondary">
          Weiter stöbern
        </Link>
      </div>
    );
  }

  private renderConfirmation() {
    return (
      <section className="checkout-confirmation">
        <div className="checkout-confirmation-icon">
          <img src="/assets/icons/check.png" alt="check" />
        </div>
        <h2>Bestellung erfolgreich!</h2>
        <p>
          Vielen Dank für deine Bestellung. <br />
          Deine Lieferung wird voraussichtlich am <strong>{this.deliveryDate}</strong> eintreffen.
        </p>
        {this.renderConfirmationActions()}
      </section>
    );
  }

  private renderEmptyCart() {
    return (
      <section className="checkout-empty">
        <h2>Warenkorb ist leer</h2>
        <Link to="/">Weiter stöbern</Link>
      </section>
    );
  }

  private renderHeader() {
    return (
      <div className="checkout-header">
        <div>
          <h2>Bestellung abschließen</h2>
          <p>Bitte überprüfe deine Daten vor dem Kauf.</p>
        </div>
        <Link to="/cart">← Warenkorb</Link>
      </div>
    );
  }

  private renderSubmit() {
    return (
      <div className="checkout-card checkout-submit">
        <label>
          <input
            type="checkbox"
            checked={this.state.agbAccepted}
            onChange={(event) => this.setState({ agbAccepted: event.target.checked, errorMsg: "" })}
          />
          <span>Ich stimme den <strong>AGB</strong> zu.</span>
        </label>
        <button onClick={this.handleOrder}>Kostenpflichtig bestellen</button>
      </div>
    );
  }

  private renderMainContent() {
    return (
      <section className="checkout-page">
        {this.renderHeader()}
        {this.state.errorMsg && <p className="checkout-error">{this.state.errorMsg}</p>}
        {this.renderAddresses()}
        <div className="checkout-delivery-info">
          Voraussichtliche Lieferung: <strong>{this.deliveryDate}</strong>
        </div>
        {this.renderItems()}
        {this.renderSummary()}
        {this.renderSubmit()}
      </section>
    );
  }

  render() {
    const { cartItems, loggedUser } = this.props;
    if (!loggedUser) return <Navigate to="/cart" replace />;
    if (this.state.ordered) return this.renderConfirmation();
    if (cartItems.length === 0) return this.renderEmptyCart();
    return this.renderMainContent();
  }
}