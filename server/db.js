import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Determine workspace data directory
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'quizclub.db');
const BACKUP_JSON_PATH = path.join(DATA_DIR, 'registrations.json');

// Admin credentials
export const ADMIN_PASSKEY = process.env.QUIZ_CLUB_ADMIN_PASSKEY || 'Silicon@Quiz2026';
// Active session tokens: token -> timestamp
const activeAdminTokens = new Set();

let sqliteDb = null;

// Initialize SQLite Database if available in Node
try {
  const { DatabaseSync } = await import('node:sqlite');
  sqliteDb = new DatabaseSync(DB_PATH);
  
  // Enable WAL mode for better concurrency and performance
  sqliteDb.exec('PRAGMA journal_mode = WAL;');
  
  // Create registrations table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      sic_no TEXT NOT NULL,
      branch TEXT NOT NULL,
      tenth_percentage REAL NOT NULL,
      twelfth_percentage REAL NOT NULL,
      interested_subject TEXT NOT NULL,
      declaration_accepted INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reg_sic ON registrations(sic_no);
    CREATE INDEX IF NOT EXISTS idx_reg_branch ON registrations(branch);
    CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at);
  `);
  console.log('[DB] SQLite database initialized at', DB_PATH);
} catch (err) {
  console.warn('[DB] node:sqlite could not be loaded, using JSON file database fallback:', err.message);
}

// Backup JSON file helper
function readJsonBackup() {
  try {
    if (fs.existsSync(BACKUP_JSON_PATH)) {
      const content = fs.readFileSync(BACKUP_JSON_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('[DB] Error reading backup JSON:', e.message);
  }
  return [];
}

function writeJsonBackup(list) {
  try {
    const tempPath = `${BACKUP_JSON_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(list, null, 2), 'utf-8');
    fs.renameSync(tempPath, BACKUP_JSON_PATH);
  } catch (e) {
    console.error('[DB] Error writing backup JSON:', e.message);
  }
}

// Generate unique, official reference ID (e.g. SQC-2026-A8K2F)
export function generateReferenceId() {
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SQC-2026-${rand}`;
}

// Sanitize string to prevent basic injection / XSS
export function sanitizeText(val) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '') // remove html tag delimiters
    .trim();
}

/**
 * Save a new registration
 */
export function saveRegistration(data) {
  const refId = generateReferenceId();
  const timestamp = new Date().toISOString();
  
  const record = {
    ref_id: refId,
    name: sanitizeText(data.name),
    sic_no: sanitizeText(data.sicNo).toUpperCase(),
    branch: sanitizeText(data.branch),
    tenth_percentage: parseFloat(Number(data.tenthPercentage).toFixed(2)),
    twelfth_percentage: parseFloat(Number(data.twelfthPercentage).toFixed(2)),
    interested_subject: sanitizeText(data.interestedSubject),
    declaration_accepted: data.declarationAccepted ? 1 : 0,
    created_at: timestamp
  };

  // 1. Save to SQLite if available
  if (sqliteDb) {
    const stmt = sqliteDb.prepare(`
      INSERT INTO registrations (
        ref_id, name, sic_no, branch, tenth_percentage, twelfth_percentage,
        interested_subject, declaration_accepted, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      record.ref_id,
      record.name,
      record.sic_no,
      record.branch,
      record.tenth_percentage,
      record.twelfth_percentage,
      record.interested_subject,
      record.declaration_accepted,
      record.created_at
    );
  }

  // 2. Dual-sync to JSON file backup for durability and inspection
  const currentList = readJsonBackup();
  currentList.unshift(record);
  writeJsonBackup(currentList);

  return {
    refId: record.ref_id,
    timestamp: record.created_at
  };
}

/**
 * Retrieve registrations with search and filtering
 */
export function getRegistrations({ search = '', branch = '', subject = '' } = {}) {
  const s = sanitizeText(search).toLowerCase();
  const b = sanitizeText(branch);
  const sub = sanitizeText(subject);

  if (sqliteDb) {
    let sql = 'SELECT * FROM registrations WHERE 1=1';
    const params = [];

    if (b && b !== 'ALL') {
      sql += ' AND branch LIKE ?';
      params.push(`%${b}%`);
    }

    if (sub && sub !== 'ALL') {
      sql += ' AND interested_subject LIKE ?';
      params.push(`%${sub}%`);
    }

    if (s) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(sic_no) LIKE ? OR LOWER(ref_id) LIKE ?)';
      params.push(`%${s}%`, `%${s}%`, `%${s}%`);
    }

    sql += ' ORDER BY id DESC';

    const stmt = sqliteDb.prepare(sql);
    const rows = stmt.all(...params);
    return rows;
  }

  // Fallback to JSON array
  let list = readJsonBackup();
  if (b && b !== 'ALL') {
    list = list.filter((r) => r.branch.toLowerCase().includes(b.toLowerCase()));
  }
  if (sub && sub !== 'ALL') {
    list = list.filter((r) => r.interested_subject.toLowerCase().includes(sub.toLowerCase()));
  }
  if (s) {
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.sic_no.toLowerCase().includes(s) ||
        r.ref_id.toLowerCase().includes(s)
    );
  }
  return list;
}

/**
 * Retrieve registration statistics
 */
export function getStats() {
  const all = getRegistrations();
  const total = all.length;
  
  const branchCounts = {};
  const subjectCounts = {};
  let todayCount = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  all.forEach((item) => {
    // Count branch
    const b = item.branch || 'Unknown';
    branchCounts[b] = (branchCounts[b] || 0) + 1;

    // Count subject
    let subj = item.interested_subject || 'Other';
    if (subj.startsWith('Other')) subj = 'Other';
    subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;

    // Count today
    if (item.created_at && item.created_at.startsWith(todayStr)) {
      todayCount++;
    }
  });

  return {
    total,
    todayCount,
    branchCounts,
    subjectCounts,
    recentCount: Math.min(total, 5)
  };
}

/**
 * Generate formatted CSV export
 */
export function exportCSV() {
  const records = getRegistrations();
  const headers = [
    'Reference ID',
    'Full Name',
    'SIC Number',
    'Branch',
    '10th Result (%)',
    '12th Result (%)',
    'Interested Subject',
    'Declaration Accepted',
    'Registration Date & Time'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) => [
    escapeCsv(r.ref_id),
    escapeCsv(r.name),
    escapeCsv(r.sic_no),
    escapeCsv(r.branch),
    escapeCsv(r.tenth_percentage),
    escapeCsv(r.twelfth_percentage),
    escapeCsv(r.interested_subject),
    escapeCsv(r.declaration_accepted ? 'Yes' : 'No'),
    escapeCsv(r.created_at)
  ]);

  return [headers.map(h => `"${h}"`).join(','), ...rows.map((row) => row.join(','))].join('\r\n');
}

/**
 * Admin authentication session manager
 */
export function authenticateAdmin(passkey) {
  if (passkey && passkey.trim() === ADMIN_PASSKEY.trim()) {
    const token = crypto.randomBytes(24).toString('hex');
    activeAdminTokens.add(token);
    return { success: true, token };
  }
  return { success: false, message: 'Invalid Admin Credentials' };
}

export function verifyAdminToken(token) {
  if (!token) return false;
  return activeAdminTokens.has(token);
}

export function revokeAdminToken(token) {
  if (token) {
    activeAdminTokens.delete(token);
  }
  return true;
}
