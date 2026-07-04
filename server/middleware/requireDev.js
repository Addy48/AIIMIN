/**
 * requireDev.js — owner/dev gate for admin tooling routes.
 */
import { resolveAccess } from '../services/accessService.js';

export async function requireDevOrOwner(c, next) {
  const userId = c.get('userId');
  const authUser = c.get('user');

  try {
    const access = await resolveAccess({
      email: authUser?.email,
      cognitoSub: c.get('cognitoSub') || null,
      userId,
    });

    if (access.role !== 'owner' && access.role !== 'dev') {
      return c.json({ error: 'Forbidden: owner or dev role required' }, 403);
    }

    c.set('accessRole', access.role);
    await next();
  } catch (err) {
    console.error('[requireDevOrOwner]', err.message);
    return c.json({ error: 'Forbidden' }, 403);
  }
}
