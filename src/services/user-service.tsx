import type { User, Delivery } from "../interface/user";

type FormData = Record<string, string>;

/** Returns the edited value for a field, or the fallback if untouched. */
export function mergedValue(
  formData: FormData,
  field: string,
  fallback: string,
): string {
  return formData[field] ?? fallback;
}

/** Merges form data into the primary delivery address. */
export function mergedDelivery(
  primary: Delivery | undefined,
  formData: FormData,
): Delivery | undefined {
  const {
    deliveryStreet,
    deliveryZip,
    deliveryCity,
    deliveryCountry,
  } = formData;

  if (
    !primary &&
    !deliveryStreet &&
    !deliveryZip &&
    !deliveryCity &&
    !deliveryCountry
  ) {
    return undefined;
  }

  return {
    id: primary?.id ?? Date.now(),
    Firstname: mergedValue(
      formData,
      "deliveryFirstname",
      primary?.Firstname ?? "",
    ),
    Lastname: mergedValue(
      formData,
      "deliveryLastname",
      primary?.Lastname ?? "",
    ),
    street: mergedValue(
      formData,
      "deliveryStreet",
      primary?.street ?? "",
    ),
    zip: mergedValue(
      formData,
      "deliveryZip",
      primary?.zip ?? "",
    ),
    city: mergedValue(
      formData,
      "deliveryCity",
      primary?.city ?? "",
    ),
    country: mergedValue(
      formData,
      "deliveryCountry",
      primary?.country ?? "",
    ),
  };
}

/** Builds the updated delivery list. */
export function buildDeliveryList(
  user: User,
  formData: FormData,
): Delivery[] | undefined {
  const rest = (user.deliveryAddress ?? []).slice(1);
  const updated = mergedDelivery(user.deliveryAddress?.[0], formData);

  return updated ? [updated, ...rest] : user.deliveryAddress;
}

/** Builds the full update payload for saving a profile. */
export function buildUserUpdate(
  user: User,
  formData: FormData,
): Partial<User> {
  return {
    Firstname: mergedValue(formData, "firstname", user.Firstname),
    Lastname: mergedValue(formData, "lastname", user.Lastname),
    email: mergedValue(formData, "email", user.email),
    street: mergedValue(formData, "billingStreet", user.street ?? ""),
    zip: mergedValue(formData, "billingZip", user.zip ?? ""),
    city: mergedValue(formData, "billingCity", user.city ?? ""),
    country: mergedValue(formData, "billingCountry", user.country ?? ""),
    deliveryAddress: buildDeliveryList(user, formData),
  };
}