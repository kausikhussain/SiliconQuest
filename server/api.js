import {
  saveRegistration,
  getRegistrations,
  getStats,
  exportCSV,
  authenticateAdmin,
  verifyAdminToken,
  revokeAdminToken,
  sanitizeText,
  ensureDbReady,
  isPostgresReady,
  hasDbConnectionUrl
} from './db.js';

// Helper to read request body as JSON (handles both stream and pre-parsed)
export async function readJsonBody(req) {
  // Vercel serverless pre-parses the body
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }

  // Stream-based (Node HTTP server / Vite dev)
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON response
export function sendJson(res, statusCode, data) {
  // Vercel serverless uses res.status().json() pattern
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  // Node http.ServerResponse
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

// Helper to extract bearer token
function getBearerToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

const VALID_BRANCHES = [
  'CSE', 'ECE', 'ME', 'CE', 'EE',
  'CSE — Computer Science and Engineering',
  'ECE — Electronics and Communication Engineering',
  'ME — Mechanical Engineering',
  'CE — Civil Engineering',
  'EE — Electrical Engineering'
];

const VALID_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Other'];

/**
 * Handle API requests
 * Returns true if the request was handled, false otherwise
 */
export async function handleApiRequest(req, res) {
  const url = req.url || '/';
  const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (typeof res.status === 'function') {
      return res.status(204).end();
    }
    res.statusCode = 204;
    res.end();
    return true;
  }

  // Ensure database is initialized
  await ensureDbReady();

  // 1. POST /api/register
  if (pathname === '/api/register' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);

      // Validation
      const errors = [];

      const name = sanitizeText(data.name);
      if (!name || name.length < 2) {
        errors.push('Full Name is required and must be at least 2 characters.');
      }

      const sicNo = sanitizeText(data.sicNo);
      if (!sicNo || sicNo.length < 3) {
        errors.push('Student SIC Number is required.');
      }

      const branch = sanitizeText(data.branch);
      const isBranchValid = VALID_BRANCHES.some(
        (b) => b.toLowerCase() === branch.toLowerCase() || branch.toLowerCase().startsWith(b.slice(0, 3).toLowerCase())
      );
      if (!branch || !isBranchValid) {
        errors.push('A valid branch must be selected (CSE, ECE, ME, CE, EE).');
      }

      const tenth = Number(String(data.tenthPercentage || '').replace(/%/g, '').trim());
      if (isNaN(tenth) || tenth < 0 || tenth > 100) {
        errors.push('10th Result percentage must be a valid number between 0 and 100.');
      }

      const twelfth = Number(String(data.twelfthPercentage || '').replace(/%/g, '').trim());
      if (isNaN(twelfth) || twelfth < 0 || twelfth > 100) {
        errors.push('12th Result percentage must be a valid number between 0 and 100.');
      }

      let interestedSubject = sanitizeText(data.interestedSubject);
      if (!interestedSubject) {
        errors.push('Interested Subject must be selected.');
      } else if (interestedSubject.toLowerCase() === 'other') {
        const otherSubject = sanitizeText(data.otherSubject);
        if (!otherSubject || otherSubject.length < 2) {
          errors.push('Please specify your interested subject.');
        } else {
          interestedSubject = `Other: ${otherSubject}`;
        }
      } else if (!VALID_SUBJECTS.includes(interestedSubject)) {
        errors.push('Invalid subject selection.');
      }

      if (!data.declarationAccepted) {
        errors.push('You must accept the Silicon Quiz Club declaration before proceeding.');
      }

      if (errors.length > 0) {
        sendJson(res, 400, { success: false, errors, message: errors[0] });
        return true;
      }

      // Persist to database
      const result = await saveRegistration({
        name,
        sicNo,
        branch,
        tenthPercentage: tenth,
        twelfthPercentage: twelfth,
        interestedSubject,
        declarationAccepted: true
      });

      if (result.isExisting) {
        sendJson(res, 200, {
          success: true,
          refId: result.refId,
          alreadyRegistered: true,
          message: 'Your registration has already been recorded for Silicon Institute of Technology Quiz Club.',
          timestamp: result.timestamp
        });
        return true;
      }

      sendJson(res, 201, {
        success: true,
        refId: result.refId,
        alreadyRegistered: false,
        message: 'Registration successfully submitted to Silicon Institute of Technology Quiz Club.',
        timestamp: result.timestamp
      });
      return true;
    } catch (err) {
      console.error('[API] Error in /api/register:', err);
      sendJson(res, 500, { success: false, message: 'Internal Server Error processing registration' });
      return true;
    }
  }

  // 2. POST /api/admin/login
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const passkey = data.passkey || data.password;
      const result = authenticateAdmin(passkey);

      if (result.success) {
        sendJson(res, 200, { success: true, token: result.token });
      } else {
        sendJson(res, 401, { success: false, message: 'Invalid Admin Credentials' });
      }
      return true;
    } catch (err) {
      console.error('[API] Error in /api/admin/login:', err);
      sendJson(res, 500, { success: false, message: 'Admin authentication failed' });
      return true;
    }
  }

  // 3. POST /api/admin/logout
  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const token = getBearerToken(req);
    revokeAdminToken(token);
    sendJson(res, 200, { success: true });
    return true;
  }

  // 4. GET /api/admin/registrations (PROTECTED)
  if (pathname === '/api/admin/registrations' && req.method === 'GET') {
    const token = getBearerToken(req);
    if (!verifyAdminToken(token)) {
      sendJson(res, 401, { success: false, message: 'Unauthorized: Admin passkey required' });
      return true;
    }

    const search = parsedUrl.searchParams.get('search') || '';
    const branch = parsedUrl.searchParams.get('branch') || '';
    const subject = parsedUrl.searchParams.get('subject') || '';
    const sort = parsedUrl.searchParams.get('sort') || 'date';

    const records = await getRegistrations({ search, branch, subject, sort });
    const stats = await getStats();

    const dbStatus = isPostgresReady()
      ? 'PostgreSQL (Cloud Database Connected)'
      : (hasDbConnectionUrl() ? 'PostgreSQL Connecting...' : 'Standalone Serverless Cache');

    sendJson(res, 200, {
      success: true,
      total: records.length,
      registrations: records,
      stats,
      dbStatus,
      isCloudDatabase: isPostgresReady()
    });
    return true;
  }

  // 5. GET /api/admin/stats (PROTECTED)
  if (pathname === '/api/admin/stats' && req.method === 'GET') {
    const token = getBearerToken(req);
    if (!verifyAdminToken(token)) {
      sendJson(res, 401, { success: false, message: 'Unauthorized: Admin passkey required' });
      return true;
    }

    const stats = await getStats();
    const dbStatus = isPostgresReady()
      ? 'PostgreSQL (Cloud Database Connected)'
      : (hasDbConnectionUrl() ? 'PostgreSQL Connecting...' : 'Standalone Serverless Cache');

    sendJson(res, 200, {
      success: true,
      stats,
      dbStatus,
      isCloudDatabase: isPostgresReady()
    });
    return true;
  }

  // 6. GET /api/admin/export-csv (PROTECTED)
  if (pathname === '/api/admin/export-csv' && req.method === 'GET') {
    const token = getBearerToken(req) || parsedUrl.searchParams.get('token');
    if (!verifyAdminToken(token)) {
      sendJson(res, 401, { success: false, message: 'Unauthorized: Admin passkey required' });
      return true;
    }

    const csvContent = await exportCSV();
    const filename = `silicon_quiz_club_registrations_${new Date().toISOString().split('T')[0]}.csv`;

    if (typeof res.status === 'function') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(csvContent);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(csvContent);
    return true;
  }

  // Not handled
  return false;
}
