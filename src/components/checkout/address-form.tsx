import type { ChangeHandler, Values } from "../../interface/checkout";
import { BILLING, SHIPPING } from "../../services/checkout-service";
import { BILLING_ROWS, SHIPPING_ROWS, type AddressField } from "./address-fields";

/** Props for the AddressForm component. */
interface AddressFormProps {
  /** Form field values for the billing address. */
  billing?: Values;
  /** Form field values for the shipping address. */
  shipping?: Values;
  /** Flag indicating whether the shipping address is identical to the billing address. */
  sameAsBilling?: boolean;
  /** Callback fired when the "same as billing" checkbox state changes. */
  onToggleSameAsBilling?: (checked: boolean) => void;
  /** Callback fired when a billing address field is updated. */
  onUpdateBilling?: ChangeHandler;
  /** Callback fired when a shipping address field is updated. */
  onUpdateShipping?: ChangeHandler;
}

/** Values and change handler shared by all address parts. */
interface CardProps {
  values: Values;
  onChange: ChangeHandler;
}

const noop: ChangeHandler = () => {};

/**
 * Labeled text input component.
 *
 * @param props - Component properties including label, value, and change handler.
 */
function TextField({ label, value = "", onChange }: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="checkout-field">
      <span>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/**
 * Renders one row of fields; several fields are placed side by side.
 */
function FieldRow({ fields, values, onChange }: CardProps & {
  fields: AddressField[];
}) {
  const inputs = fields.map((field) => (
    <TextField
      key={field.key}
      label={field.label}
      value={values[field.key]}
      onChange={(value) => onChange(field.key, value)}
    />
  ));

  if (fields.length === 1) return <>{inputs}</>;
  return <div className="checkout-field-row">{inputs}</div>;
}

/**
 * Renders a section card with a title and the given rows of input fields.
 */
function AddressCard({ title, rows, ...shared }: CardProps & {
  title: string;
  rows: AddressField[][];
}) {
  return (
    <div className="checkout-card">
      <h3>{title}</h3>
      {rows.map((fields) => (
        <FieldRow key={fields[0].key} fields={fields} {...shared} />
      ))}
    </div>
  );
}

/** Billing address section card. */
function BillingCard(props: CardProps) {
  return <AddressCard title={BILLING.title} rows={BILLING_ROWS} {...props} />;
}

/** Shipping address section card. */
function ShippingCard(props: CardProps) {
  return <AddressCard title={SHIPPING.title} rows={SHIPPING_ROWS} {...props} />;
}

/**
 * Renders billing and shipping address input forms during the checkout process,
 * featuring a top checkbox bar and a side-by-side grid layout for addresses.
 */
export function AddressForm(props: AddressFormProps) {
  const {
    billing = {},
    shipping = {},
    sameAsBilling = true,
    onToggleSameAsBilling = () => {},
    onUpdateBilling = noop,
    onUpdateShipping = noop,
  } = props;

  return (
    <div className="checkout-address-container">
      <div className="checkout-same-address-wrapper">
        <label className="checkout-same-address-label">
          <input
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) => onToggleSameAsBilling(e.target.checked)}
          />
          <span>Lieferadresse entspricht der Rechnungsadresse</span>
        </label>
      </div>
      <div className="checkout-addresses">
        <BillingCard values={billing} onChange={onUpdateBilling} />
        {!sameAsBilling && (
          <ShippingCard values={shipping} onChange={onUpdateShipping} />
        )}
      </div>
    </div>
  );
}