/** Shared VN phone helpers — used by booking form (client) and appointments API. */

export function normalizePhone(phone: string) {
  return phone.replace(/[\s().-]/g, '')
}

/** Accepts 09xxxxxxxx, 0xxxxxxxxx, or +84xxxxxxxxx. */
export function isValidVnPhone(phone: string) {
  const n = normalizePhone(phone)
  return /^(0|\+84)[0-9]{8,10}$/.test(n)
}
