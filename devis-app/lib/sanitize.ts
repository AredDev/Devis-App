/**
 * Escapes HTML characters to prevent XSS injection.
 */
export function sanitizeString(val: string): string {
  if (!val) return '';
  return val
    .trim()
    // Strip script tags entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Escape standard HTML characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Iterates through all fields of the devis input and sanitizes any string fields,
 * keeping numeric arrays (nuisibles) or numbers (surface) intact.
 */
export function sanitizeInput<T extends Record<string, any>>(input: T): T {
  const sanitized = { ...input } as any;

  for (const key in sanitized) {
    if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
      const val = sanitized[key];
      if (typeof val === 'string') {
        sanitized[key] = sanitizeString(val);
      } else if (Array.isArray(val)) {
        sanitized[key] = val.map(item => (typeof item === 'string' ? sanitizeString(item) : item));
      }
    }
  }

  return sanitized as T;
}
