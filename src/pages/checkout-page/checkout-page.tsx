import "./checkout-page.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import type { User } from "../../interface/user";
import { useAuth } from "../../context/use-auth";
import { useCartContext } from "../../context/use-cart-context";
import { useCheckoutForm } from "./use-checkout-form";
import { AddressForm } from "../../components/checkout/address-form";
import { CheckoutSubmit } from "../../components/checkout/checkout-submit";
import CheckoutHeader from "../../components/checkout/checkout-header";
import CheckoutEmpty from "../../components/checkout/checkout-empty";
import CheckoutConfirmation from "../../components/checkout/checkout-confirmation";
import OrderOverview from "../../components/checkout/order-overview";

interface FormProps {
  user: User;
  onOrdered: () => void;
}

function CheckoutForm({ user, onOrdered }: FormProps) {
  const form = useCheckoutForm(user, onOrdered);
  const { cartItems } = useCartContext();

  return (
    <section className="checkout-page">
      <CheckoutHeader />
      {form.error && <p className="checkout-error" role="alert">{form.error}</p>}
      
      <AddressForm 
        billing={form.billing} 
        shipping={form.shipping} 
        onUpdateBilling={form.changeBilling} 
        onUpdateShipping={form.changeShipping} 
      />

      <OrderOverview items={cartItems} />
      <CheckoutSubmit onSubmit={form.submit} />
    </section>
  );
}

function CheckoutPage() {
  const { cartItems } = useCartContext();
  const { loggedUser } = useAuth();
  const [ordered, setOrdered] = useState(false);

  if (!loggedUser) return <Navigate to="/cart" replace />;
  if (ordered) return <CheckoutConfirmation />;
  if (cartItems.length === 0) return <CheckoutEmpty />;
  return <CheckoutForm user={loggedUser} onOrdered={() => setOrdered(true)} />;
}

export default CheckoutPage;