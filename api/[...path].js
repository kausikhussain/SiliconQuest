import { sendJson } from '../server/api.js';

export default async function handler(req, res) {
  sendJson(res, 404, {
    success: false,
    message: `API endpoint not found: ${req.method} ${req.url}`
  });
}
