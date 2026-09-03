import {
  saveRegistration,
  getRegistrations,
  getStats,
  exportCSV,
  authenticateAdmin,
  verifyAdminToken,
  revokeAdminToken,
  sanitizeText
} from './db.js';

// Helper to read request body as JSON
export async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Guard against payloads larger than 1MB
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
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// Helper to extract bearer token
function getBearerToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

const VALID_BRANCHES = [
  'CSE',
  'ECE',
  'ME',
  'CE',
  'EE',
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
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight if ever called cross-origin
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    res.end();
    return true;
  }

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

      const tenth = Number(data.tenthPercentage);
      if (isNaN(tenth) || tenth < 0 || tenth > 100) {
        errors.push('10th Result percentage must be a valid number between 0 and 100.');
      }

      const twelfth = Number(data.twelfthPercentage);
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
      const result = saveRegistration({
        name,
        sicNo,
        branch,
        tenthPercentage: tenth,
        twelfthPercentage: twelfth,
        interestedSubject,
        declarationAccepted: true
      });

      sendJson(res, 201, {
        success: true,
        refId: result.refId,
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

    const records = getRegistrations({ search, branch, subject });
    const stats = getStats();

    sendJson(res, 200, {
      success: true,
      total: records.length,
      registrations: records,
      stats
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

    const stats = getStats();
    sendJson(res, 200, { success: true, stats });
    return true;
  }

  // 6. GET /api/admin/export-csv (PROTECTED)
  if (pathname === '/api/admin/export-csv' && req.method === 'GET') {
    const token = getBearerToken(req) || parsedUrl.searchParams.get('token');
    if (!verifyAdminToken(token)) {
      sendJson(res, 401, { success: false, message: 'Unauthorized: Admin passkey required' });
      return true;
    }

    const csvContent = exportCSV();
    const filename = `silicon_quiz_club_registrations_${new Date().toISOString().split('T')[0]}.csv`;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(csvContent);
    return true;
  }

  // Not handled
  return false;
}
