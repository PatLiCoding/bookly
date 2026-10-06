import type { User, Delivery } from "../interface/user";

type FormData = Record<string, string>;

/**
 * Returns the edited value for a form field if present in the form data,
 * or falls back to the provided fallback value if untouched.
 *
 * @param formData - The record containing key-value form field entries.
 * @param field - The key/name of the form field to retrieve.
 * @param fallback - The default string value to return if the field is not present.
 * @returns The field value from `formData` or the `fallback` value.
 */
export function mergedValue(
  formData: FormData, field: string, fallback: string,): string {
  return formData[field] ?? fallback;
}

/**
 * Merges form data into the primary delivery address.
 *
 * If no primary delivery address exists and no delivery-related fields are provided
 * in the form data, returns `undefined`.
 *
 * @param primary - The existing primary delivery address, if any.
 * @param formData - The form data object containing optional delivery field overrides.
 * @returns The updated delivery address object, or `undefined` if no delivery information is available.
 */
export function mergedDelivery(
  primary: Delivery | undefined,
  formData: FormData,
): Delivery | undefined {
  const {deliveryStreet, deliveryZip, deliveryCity, deliveryCountry, } = formData;

  if (!primary && !deliveryStreet && !deliveryZip && !deliveryCity && !deliveryCountry ) {
    return undefined;
  }

  return {
    id: primary?.id ?? Date.now(),
    Firstname: mergedValue(formData, "deliveryFirstname", primary?.Firstname ?? "",),
    Lastname: mergedValue(formData, "deliveryLastname", primary?.Lastname ?? "", ),
    street: mergedValue(formData, "deliveryStreet", primary?.street ?? "",),
    zip: mergedValue(formData, "deliveryZip", primary?.zip ?? "",),
    city: mergedValue(formData, "deliveryCity", primary?.city ?? "",),
    country: mergedValue(formData, "deliveryCountry", primary?.country ?? "", ),
  };
}

/**
 * Builds the updated delivery list by replacing the primary delivery address
 * with merged form values while preserving remaining secondary addresses.
 *
 * @param user - The user object containing current profile and address data.
 * @param formData - The form data containing potential updates to the primary delivery address.
 * @returns The updated list of delivery addresses, or the original list if no update occurred.
 */
export function buildDeliveryList(
  user: User, formData: FormData,): Delivery[] | undefined {
  const rest = (user.deliveryAddress ?? []).slice(1);
  const updated = mergedDelivery(user.deliveryAddress?.[0], formData);

  return updated ? [updated, ...rest] : user.deliveryAddress;
}

/**
 * Builds a partial update payload for saving a user profile by merging existing
 * user data with modified fields from form data.
 *
 * @param user - The original user profile data.
 * @param formData - The submitted form data containing updated field values.
 * @returns A partial `User` object containing only updated/merged attributes for persistence.
 */
export function buildUserUpdate(
  user: User, formData: FormData,): Partial<User> {
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