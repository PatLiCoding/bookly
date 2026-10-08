import { QuantityControl } from "../quantity-control/quantity-control";
import { useCartContext } from "../../context/use-cart-context";
import { formatPrice } from "../../utils/price";
import type { CartItem } from "../../interface/cart-item";

/** Props for components that display a single cart item. */
interface ItemProps {
  item: CartItem;
}

/** Quantity control of a cart item. */
function ItemQuantity({ item }: ItemProps) {
  const { increaseItem, decreaseItem } = useCartContext();

  return (
    <QuantityControl
      quantity={item.quantity}
      onIncrease={() => increaseItem(item.id)}
      onDecrease={() => decreaseItem(item.id)}
    />
  );
}

/** Button that removes a cart item completely. */
function RemoveButton({ id }: { id: CartItem["id"] }) {
  const { removeItem } = useCartContext();

  return (
    <button className="cart-item-remove" onClick={() => removeItem(id)}>
      Entfernen
    </button>
  );
}

/** Quantity, line price and remove button of a cart item. */
function CartItemActions({ item }: ItemProps) {
  return (
    <div className="cart-item-actions">
      <ItemQuantity item={item} />
      <span className="cart-item-price">
        {formatPrice(item.price * item.quantity)}
      </span>
      <RemoveButton id={item.id} />
    </div>
  );
}

/** Single line item with cover, info and actions. */
function CartItemRow({ item }: ItemProps) {
  return (
    <div className="cart-item">
      <div className="cart-item-cover">
        <img src={item.cover} alt={item.title} />
      </div>
      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-author">Autor: {item.author}</p>
      </div>
      <CartItemActions item={item} />
    </div>
  );
}

/** Renders all line items of the cart. */
function CartItemList({ items }: { items: CartItem[] }) {
  return (
    <div className="cart-page-items">
      {items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}

export default CartItemList;