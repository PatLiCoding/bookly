export interface Delivery {
  id: string | number;
  street: string;
  zip: number;
  country: string;
}

export interface User {
  id: number;
  Firstname: string;
  Lastname: string;
  email: string;
  passwort: string;
  deliveryAddress?: Delivery[];
  reviews?: [];
  order?: [];
}
