import { handleApiRequest, sendJson } from '../../server/api.js';

export default async function handler(req, res) {
  try {
    req.url = '/api/admin/login';
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      sendJson(res, 405, { success: false, message: 'Method not allowed. Use POST.' });
    }
  } catch (err) {
    console.error('[Vercel /api/admin/login] Unhandled error:', err);
    sendJson(res, 500, { success: false, message: 'Internal server error' });
  }
}
