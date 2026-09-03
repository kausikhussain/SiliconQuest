import { handleApiRequest, sendJson } from '../../server/api.js';

export default async function handler(req, res) {
  try {
    // Preserve query parameters
    const queryString = req.url?.split('?')[1] || '';
    req.url = '/api/admin/registrations' + (queryString ? `?${queryString}` : '');
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      sendJson(res, 405, { success: false, message: 'Method not allowed. Use GET.' });
    }
  } catch (err) {
    console.error('[Vercel /api/admin/registrations] Unhandled error:', err);
    sendJson(res, 500, { success: false, message: 'Internal server error' });
  }
}
