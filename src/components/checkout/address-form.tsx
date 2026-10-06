import type { ChangeEvent } from "react";
import type { ChangeHandler, Values } from "../../interface/checkout";
import { BILLING, SHIPPING } from "../../services/checkout-service";

/** Props for the AddressForm component. */
interface AddressFormProps {
  /** Form field values for the billing address. */
  billing?: Values;
  /** Form field values for the shipping address. */
  shipping?: Values;
  /** Callback fired when a billing address field is updated. */
  onUpdateBilling?: ChangeHandler;
  /** Callback fired when a shipping address field is updated. */
  onUpdateShipping?: ChangeHandler;
}

/**
 * Renders billing and shipping address input forms during the checkout process.
 */
export function AddressForm({
  billing = {},
  shipping = {},
  onUpdateBilling,
  onUpdateShipping,
}: AddressFormProps) {
  /**
   * Invokes the billing update callback with the specified key-value pair.
   *
   * @param key - The field identifier.
   * @param value - The updated field value.
   */
  const handleBillingChange = (key: string, value: string) => {
    if (onUpdateBilling) {
      onUpdateBilling(key, value);
    }
  };

  /**
   * Invokes the shipping update callback with the specified key-value pair.
   *
   * @param key - The field identifier.
   * @param value - The updated field value.
   */
  const handleShippingChange = (key: string, value: string) => {
    if (onUpdateShipping) {
      onUpdateShipping(key, value);
    }
  };

  /**
   * Helper method to render a labeled input field.
   *
   * @param label - Visible text label above the input.
   * @param value - Current value string of the input field.
   * @param onChange - Callback triggered upon input value change.
   * @returns JSX element containing the input field.
   */
  const renderInput = (
    label: string,
    value: string = "",
    onChange: (value: string) => void
  ) => {
    return (
      <label className="checkout-field">
        <span>{label}</span>
        <input
          type="text"
          value={value ?? ""}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
        />
      </label>
    );
  };

  /** Renders name and street address fields for billing. */
  const renderBillingMainFields = () => (
    <>
      {renderInput("Name", billing.name, (v) => handleBillingChange("name", v))}
      {renderInput("Straße & Hausnummer", billing.street, (v) =>
        handleBillingChange("street", v)
      )}
    </>
  );

  /** Renders postal code and city fields for billing. */
  const renderBillingLocationFields = () => (
    <div className="checkout-field-row">
      {renderInput("PLZ", billing.zip, (v) => handleBillingChange("zip", v))}
      {renderInput("Ort", billing.city, (v) => handleBillingChange("city", v))}
    </div>
  );

  /** Renders the complete billing address section card. */
  const renderBillingAddress = () => (
    <div className="checkout-card">
      <h3>{BILLING.title}</h3>
      {renderBillingMainFields()}
      {renderBillingLocationFields()}
      {renderInput("Land", billing.country, (v) => handleBillingChange("country", v))}
    </div>
  );

  /** Renders first name and last name fields for shipping. */
  const renderShippingNameFields = () => (
    <div className="checkout-field-row">
      {renderInput("Vorname", shipping.Firstname, (v) =>
        handleShippingChange("Firstname", v)
      )}
      {renderInput("Nachname", shipping.Lastname, (v) =>
        handleShippingChange("Lastname", v)
      )}
    </div>
  );

  /** Renders postal code and city fields for shipping. */
  const renderShippingLocationFields = () => (
    <div className="checkout-field-row">
      {renderInput("PLZ", shipping.zip, (v) => handleShippingChange("zip", v))}
      {renderInput("Ort", shipping.city, (v) => handleShippingChange("city", v))}
    </div>
  );

  /** Renders the complete shipping address section card. */
  const renderShippingAddress = () => (
    <div className="checkout-card">
      <h3>{SHIPPING.title}</h3>
      {renderShippingNameFields()}
      {renderInput("Straße & Hausnummer", shipping.street, (v) =>
        handleShippingChange("street", v)
      )}
      {renderShippingLocationFields()}
      {renderInput("Land", shipping.country, (v) =>
        handleShippingChange("country", v)
      )}
    </div>
  );

  return (
    <div className="checkout-addresses">
      {renderBillingAddress()}
      {renderShippingAddress()}
    </div>
  );
}