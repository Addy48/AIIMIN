import sanitizeHtml from 'sanitize-html';

/**
 * Recursively strip HTML from all string values in req body.
 */
function sanitizeValue(value) {
  if (typeof value === 'string') {
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = sanitizeValue(v);
    }
    return out;
  }
  return value;
}

export async function sanitizeBody(c, next) {
  if (['POST', 'PUT', 'PATCH'].includes(c.req.method)) {
    try {
      const contentType = c.req.header('content-type') || '';
      if (contentType.includes('application/json')) {
        // Read from a clone so downstream handlers can still call c.req.json().
        const body = await c.req.raw.clone().json();
        c.set('sanitizedBody', sanitizeValue(body));
      }
    } catch {
      // Non-JSON body — skip
    }
  }
  await next();
}

export function getBody(c) {
  return c.get('sanitizedBody') ?? null;
}
