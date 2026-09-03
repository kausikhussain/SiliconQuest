import { handleApiRequest, sendJson } from '../../server/api.js';

export default async function handler(req, res) {
  try {
    const queryString = req.url?.split('?')[1] || '';
    req.url = '/api/admin/export-csv' + (queryString ? `?${queryString}` : '');
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      sendJson(res, 405, { success: false, message: 'Method not allowed. Use GET.' });
    }
  } catch (err) {
    console.error('[Vercel /api/admin/export-csv] Unhandled error:', err);
    sendJson(res, 500, { success: false, message: 'Internal server error' });
  }
}
