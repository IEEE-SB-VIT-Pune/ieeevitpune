/**
 * Allow only same-origin relative paths. Blocks protocol-relative and absolute URLs.
 */
export function getSafeRedirectPath(
  from: string | null | undefined,
  fallback: string
): string {
  if (!from) return fallback;
  if (!from.startsWith("/") || from.startsWith("//")) return fallback;
  if (from.includes("://")) return fallback;
  return from;
}
