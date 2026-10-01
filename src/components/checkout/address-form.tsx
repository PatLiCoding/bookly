import type { ChangeEvent } from "react";
import type { ChangeHandler, Values } from "../../interface/checkout";
import { BILLING, SHIPPING } from "../../services/checkout-service";

interface AddressFormProps {
  billing?: Values;
  shipping?: Values;
  onUpdateBilling?: ChangeHandler;
  onUpdateShipping?: ChangeHandler;
}

export function AddressForm({
  billing = {},
  shipping = {},
  onUpdateBilling,
  onUpdateShipping,
}: AddressFormProps) {
  const handleBillingChange = (key: string, value: string) => {
    if (onUpdateBilling) {
      onUpdateBilling(key, value);
    }
  };

  const handleShippingChange = (key: string, value: string) => {
    if (onUpdateShipping) {
      onUpdateShipping(key, value);
    }
  };

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

  const renderBillingMainFields = () => (
    <>
      {renderInput("Name", billing.name, (v) => handleBillingChange("name", v))}
      {renderInput("Straße & Hausnummer", billing.street, (v) =>
        handleBillingChange("street", v)
      )}
    </>
  );

  const renderBillingLocationFields = () => (
    <div className="checkout-field-row">
      {renderInput("PLZ", billing.zip, (v) => handleBillingChange("zip", v))}
      {renderInput("Ort", billing.city, (v) => handleBillingChange("city", v))}
    </div>
  );

  const renderBillingAddress = () => (
    <div className="checkout-card">
      <h3>{BILLING.title}</h3>
      {renderBillingMainFields()}
      {renderBillingLocationFields()}
      {renderInput("Land", billing.country, (v) => handleBillingChange("country", v))}
    </div>
  );

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

  const renderShippingLocationFields = () => (
    <div className="checkout-field-row">
      {renderInput("PLZ", shipping.zip, (v) => handleShippingChange("zip", v))}
      {renderInput("Ort", shipping.city, (v) => handleShippingChange("city", v))}
    </div>
  );

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