import { handleApiRequest, sendJson } from '../../server/api.js';

export default async function handler(req, res) {
  try {
    req.url = req.url || '/api/admin/events';
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      sendJson(res, 404, { success: false, message: 'Endpoint not found' });
    }
  } catch (err) {
    sendJson(res, 500, { success: false, message: err.message || 'Internal Server Error' });
  }
}
