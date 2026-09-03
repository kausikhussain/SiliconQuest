import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { INITIAL_REGISTRATIONS } from './seedData.js';

// ─── Environment Detection ────────────────────────────────────────────
const IS_VERCEL = !!(process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Determine writable data directory
const DATA_DIR = IS_VERCEL
  ? path.join(os.tmpdir(), 'sqc-data')
  : path.resolve(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'quizclub.db');
const BACKUP_JSON_PATH = path.join(DATA_DIR, 'registrations.json');

// Admin credentials
export const ADMIN_PASSKEY = process.env.QUIZ_CLUB_ADMIN_PASSKEY || 'Silicon@Quiz2026';
const HMAC_SECRET = process.env.QUIZ_CLUB_HMAC_SECRET || ADMIN_PASSKEY + '_hmac_key_2026';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

let pgPool = null;
let pgReady = false;

// Connection string: support DATABASE_URL, POSTGRES_URL, STORAGE_URL, etc.
const DB_CONN_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.STORAGE_POSTGRES_URL ||
  process.env.STORAGE_URL ||
  process.env.STORAGE_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

export function isPostgresReady() {
  return pgReady;
}

export function hasDbConnectionUrl() {
  return !!DB_CONN_URL;
}

async function initPostgres() {
  if (!DB_CONN_URL) return false;
  try {
    const { default: pg } = await import('pg');
    pgPool = new pg.Pool({
      connectionString: DB_CONN_URL,
      ssl: DB_CONN_URL.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 20, // Tuned for 50 concurrent students
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    // Create table if not exists
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        ref_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        sic_no TEXT NOT NULL,
        branch TEXT NOT NULL,
        tenth_percentage REAL NOT NULL,
        twelfth_percentage REAL NOT NULL,
        interested_subject TEXT NOT NULL,
        declaration_accepted INTEGER NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // Create indexes and unique constraint
    await pgPool.query('CREATE INDEX IF NOT EXISTS idx_reg_sic ON registrations(sic_no)');
    await pgPool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_reg_sic_unique ON registrations(LOWER(sic_no))');
    await pgPool.query('CREATE INDEX IF NOT EXISTS idx_reg_branch ON registrations(branch)');
    await pgPool.query('CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at)');

    // Seed initial records if empty
    const countRes = await pgPool.query('SELECT COUNT(*) as count FROM registrations');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      for (const r of INITIAL_REGISTRATIONS) {
        await pgPool.query(
          `INSERT INTO registrations (ref_id, name, sic_no, branch, tenth_percentage, twelfth_percentage, interested_subject, declaration_accepted, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (ref_id) DO NOTHING`,
          [r.ref_id, r.name, r.sic_no, r.branch, r.tenth_percentage, r.twelfth_percentage, r.interested_subject, r.declaration_accepted, r.created_at]
        );
      }
      console.log('[DB] PostgreSQL seeded with initial records');
    }

    pgReady = true;
    console.log('[DB] PostgreSQL connected via DATABASE_URL');
    return true;
  } catch (err) {
    console.warn('[DB] PostgreSQL initialization failed:', err.message);
    pgPool = null;
    pgReady = false;
    return false;
  }
}

// ─── SQLite Support (local dev & non-PG serverless) ──────────────────
let sqliteDb = null;

async function initSqlite() {
  try {
    const { DatabaseSync } = await import('node:sqlite');
    sqliteDb = new DatabaseSync(DB_PATH);
    sqliteDb.exec('PRAGMA journal_mode = WAL;');
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
      CREATE UNIQUE INDEX IF NOT EXISTS idx_reg_sic_unique ON registrations(LOWER(sic_no));
      CREATE INDEX IF NOT EXISTS idx_reg_branch ON registrations(branch);
      CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at);
    `);

    // Seed initial records if empty
    const countRow = sqliteDb.prepare('SELECT COUNT(*) as count FROM registrations').get();
    if (countRow && countRow.count === 0) {
      const insert = sqliteDb.prepare(`
        INSERT INTO registrations (ref_id, name, sic_no, branch, tenth_percentage, twelfth_percentage, interested_subject, declaration_accepted, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of INITIAL_REGISTRATIONS) {
        insert.run(r.ref_id, r.name, r.sic_no, r.branch, r.tenth_percentage, r.twelfth_percentage, r.interested_subject, r.declaration_accepted, r.created_at);
      }
      console.log('[DB] SQLite seeded with initial records');
    }

    console.log('[DB] SQLite database initialized at', DB_PATH);
    return true;
  } catch (err) {
    console.warn('[DB] node:sqlite unavailable:', err.message);
    sqliteDb = null;
    return false;
  }
}

// ─── JSON File Helpers ───────────────────────────────────────────────
function readJsonBackup() {
  try {
    if (fs.existsSync(BACKUP_JSON_PATH)) {
      const content = fs.readFileSync(BACKUP_JSON_PATH, 'utf-8');
      const list = JSON.parse(content);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch (e) {
    console.error('[DB] Error reading backup JSON:', e.message);
  }
  // Initialize with seed data if backup is empty or non-existent
  const initial = [...INITIAL_REGISTRATIONS];
  writeJsonBackup(initial);
  return initial;
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

// ─── Database Initialization ─────────────────────────────────────────
let dbInitPromise = null;

export async function ensureDbReady() {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      // Try PostgreSQL first (production)
      const pgOk = await initPostgres();
      if (pgOk) return;

      // Try SQLite next (local dev)
      const sqliteOk = await initSqlite();
      if (sqliteOk) return;

      // JSON file fallback
      console.log('[DB] Using JSON file storage at', BACKUP_JSON_PATH);
    })();
  }
  return dbInitPromise;
}

// Start init immediately on import
ensureDbReady();

// ─── Utility Functions ──────────────────────────────────────────────

export function generateReferenceId() {
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SQC-2026-${rand}`;
}

export function sanitizeText(val) {
  if (typeof val !== 'string') return '';
  return val.replace(/[<>]/g, '').trim();
}

// ─── Registration CRUD ──────────────────────────────────────────────

export async function findRegistrationBySic(sicNo) {
  await ensureDbReady();
  if (!sicNo) return null;
  const cleanSic = sanitizeText(sicNo).toUpperCase();

  // PostgreSQL
  if (pgReady && pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM registrations WHERE LOWER(sic_no) = LOWER($1) LIMIT 1', [cleanSic]);
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {
      console.error('[DB] findRegistrationBySic PG error:', e.message);
    }
  }

  // SQLite
  if (sqliteDb) {
    try {
      const row = sqliteDb.prepare('SELECT * FROM registrations WHERE LOWER(sic_no) = LOWER(?) LIMIT 1').get(cleanSic);
      if (row) return row;
    } catch (e) {
      console.error('[DB] findRegistrationBySic SQLite error:', e.message);
    }
  }

  // JSON fallback
  const list = readJsonBackup();
  return list.find((r) => r.sic_no && r.sic_no.toLowerCase() === cleanSic.toLowerCase()) || null;
}

export async function saveRegistration(data) {
  await ensureDbReady();

  const cleanSic = sanitizeText(data.sicNo).toUpperCase();

  // Idempotency check: if student already registered, return existing record
  const existing = await findRegistrationBySic(cleanSic);
  if (existing) {
    return {
      refId: existing.ref_id,
      timestamp: existing.created_at,
      isExisting: true
    };
  }

  const refId = generateReferenceId();
  const timestamp = new Date().toISOString();

  const record = {
    ref_id: refId,
    name: sanitizeText(data.name),
    sic_no: cleanSic,
    branch: sanitizeText(data.branch),
    tenth_percentage: parseFloat(Number(data.tenthPercentage).toFixed(2)),
    twelfth_percentage: parseFloat(Number(data.twelfthPercentage).toFixed(2)),
    interested_subject: sanitizeText(data.interestedSubject),
    declaration_accepted: data.declarationAccepted ? 1 : 0,
    created_at: timestamp
  };

  // PostgreSQL
  if (pgReady && pgPool) {
    try {
      await pgPool.query(
        `INSERT INTO registrations (ref_id, name, sic_no, branch, tenth_percentage, twelfth_percentage, interested_subject, declaration_accepted, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (ref_id) DO NOTHING`,
        [record.ref_id, record.name, record.sic_no, record.branch, record.tenth_percentage, record.twelfth_percentage, record.interested_subject, record.declaration_accepted, record.created_at]
      );
      // Database commit confirmed: broadcast real-time event
      recordNewEvent(record);
      return { refId: record.ref_id, timestamp: record.created_at, isExisting: false };
    } catch (err) {
      console.error('[DB] PostgreSQL insert failed:', err.message);
    }
  }

  // SQLite
  if (sqliteDb) {
    try {
      const stmt = sqliteDb.prepare(`
        INSERT INTO registrations (ref_id, name, sic_no, branch, tenth_percentage, twelfth_percentage, interested_subject, declaration_accepted, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(record.ref_id, record.name, record.sic_no, record.branch, record.tenth_percentage, record.twelfth_percentage, record.interested_subject, record.declaration_accepted, record.created_at);
    } catch (err) {
      console.error('[DB] SQLite insert failed:', err.message);
    }
  }

  // JSON file backup (always sync for durability)
  const currentList = readJsonBackup();
  currentList.unshift(record);
  writeJsonBackup(currentList);

  // Database commit confirmed: broadcast real-time event
  recordNewEvent(record);

  return { refId: record.ref_id, timestamp: record.created_at, isExisting: false };
}

export async function getRegistrations({ search = '', branch = '', subject = '', sort = 'date' } = {}) {
  await ensureDbReady();

  const s = sanitizeText(search).toLowerCase();
  const b = sanitizeText(branch);
  const sub = sanitizeText(subject);

  // Sorting SQL clause
  let orderClause = ' ORDER BY id DESC';
  if (sort === 'percentage' || sort === 'marks') {
    orderClause = ' ORDER BY twelfth_percentage DESC, tenth_percentage DESC';
  } else if (sort === 'name') {
    orderClause = ' ORDER BY LOWER(name) ASC';
  }

  // PostgreSQL
  if (pgReady && pgPool) {
    try {
      let sql = 'SELECT * FROM registrations WHERE 1=1';
      const params = [];
      let paramIdx = 1;

      if (b && b !== 'ALL') {
        sql += ` AND branch LIKE $${paramIdx++}`;
        params.push(`%${b}%`);
      }
      if (sub && sub !== 'ALL') {
        sql += ` AND interested_subject LIKE $${paramIdx++}`;
        params.push(`%${sub}%`);
      }
      if (s) {
        sql += ` AND (LOWER(name) LIKE $${paramIdx} OR LOWER(sic_no) LIKE $${paramIdx + 1} OR LOWER(ref_id) LIKE $${paramIdx + 2})`;
        params.push(`%${s}%`, `%${s}%`, `%${s}%`);
        paramIdx += 3;
      }
      sql += orderClause;

      const result = await pgPool.query(sql, params);
      return result.rows;
    } catch (err) {
      console.error('[DB] PostgreSQL query failed:', err.message);
    }
  }

  // SQLite
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
    sql += orderClause;

    const stmt = sqliteDb.prepare(sql);
    return stmt.all(...params);
  }

  // JSON fallback
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

  // Sort JSON fallback
  if (sort === 'percentage' || sort === 'marks') {
    list.sort((x, y) => (y.twelfth_percentage || 0) - (x.twelfth_percentage || 0));
  } else if (sort === 'name') {
    list.sort((x, y) => (x.name || '').localeCompare(y.name || ''));
  } else {
    // default date desc
    list.sort((x, y) => (y.id || 0) - (x.id || 0));
  }

  return list;
}

export async function getStats() {
  const all = await getRegistrations();
  const total = all.length;

  const branchCounts = {};
  const subjectCounts = {};
  let todayCount = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  all.forEach((item) => {
    const b = item.branch || 'Unknown';
    branchCounts[b] = (branchCounts[b] || 0) + 1;

    let subj = item.interested_subject || 'Other';
    if (subj.startsWith('Other')) subj = 'Other';
    subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;

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

export async function exportCSV() {
  const records = await getRegistrations();
  const headers = [
    'Reference ID', 'Full Name', 'SIC Number', 'Branch',
    '10th Result (%)', '12th Result (%)', 'Interested Subject',
    'Declaration Accepted', 'Registration Date & Time'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) => [
    escapeCsv(r.ref_id), escapeCsv(r.name), escapeCsv(r.sic_no),
    escapeCsv(r.branch), escapeCsv(r.tenth_percentage), escapeCsv(r.twelfth_percentage),
    escapeCsv(r.interested_subject), escapeCsv(r.declaration_accepted ? 'Yes' : 'No'),
    escapeCsv(r.created_at)
  ]);

  return [headers.map(h => `"${h}"`).join(','), ...rows.map((row) => row.join(','))].join('\r\n');
}

// ─── Stateless HMAC-SHA256 Admin Authentication ─────────────────────

export function authenticateAdmin(passkey) {
  if (passkey && passkey.trim() === ADMIN_PASSKEY.trim()) {
    const token = generateAdminToken();
    return { success: true, token };
  }
  return { success: false, message: 'Invalid Admin Credentials' };
}

export function verifyAdminToken(token) {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [payloadB64, expiryStr, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(`${payloadB64}.${expiryStr}`)
      .digest('hex');

    if (signature !== expectedSig) return false;

    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) return false;

    return true;
  } catch {
    return false;
  }
}

export function revokeAdminToken(_token) {
  // Stateless tokens cannot be revoked server-side without a blocklist.
  // For serverless simplicity, logout is handled client-side by discarding the token.
  return true;
}

function generateAdminToken() {
  const payload = crypto.randomBytes(16).toString('base64url');
  const expiry = String(Date.now() + TOKEN_EXPIRY_MS);
  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${payload}.${expiry}`)
    .digest('hex');
  return `${payload}.${expiry}.${signature}`;
}

// ─── Real-Time Ingestion & Event Ring Buffer ────────────────────────
const MAX_EVENT_BUFFER = 200;
const recentRegistrationEvents = [];
const sseSubscribers = new Set();

export function recordNewEvent(record) {
  const eventItem = {
    id: record.ref_id,
    type: 'registration_created',
    timestamp: record.created_at || new Date().toISOString(),
    record: { ...record }
  };

  recentRegistrationEvents.unshift(eventItem);
  if (recentRegistrationEvents.length > MAX_EVENT_BUFFER) {
    recentRegistrationEvents.pop();
  }

  // Broadcast to all active SSE subscriber response streams
  broadcastSseEvent('registration', {
    type: 'new_registration',
    record: eventItem.record,
    timestamp: eventItem.timestamp
  });

  return eventItem;
}

export function broadcastSseEvent(eventType, payload) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseSubscribers) {
    try {
      client.write(message);
    } catch {
      sseSubscribers.delete(client);
    }
  }
}

export function addSseSubscriber(res) {
  sseSubscribers.add(res);
}

export function removeSseSubscriber(res) {
  sseSubscribers.delete(res);
}

export async function getEventsSince(sinceTimestamp) {
  await ensureDbReady();

  // If timestamp provided, use it; otherwise return last 50
  if (sinceTimestamp) {
    const sinceDate = new Date(sinceTimestamp);
    if (!isNaN(sinceDate.getTime())) {
      const isoStr = sinceDate.toISOString();

      // Query authoritative PostgreSQL if available
      if (pgReady && pgPool) {
        try {
          const res = await pgPool.query(
            'SELECT * FROM registrations WHERE created_at > $1 ORDER BY created_at ASC LIMIT 100',
            [isoStr]
          );
          if (res.rows.length > 0) {
            return res.rows.map(r => ({
              id: r.ref_id,
              type: 'registration_created',
              timestamp: r.created_at,
              record: r
            }));
          }
        } catch (e) {
          console.error('[DB] getEventsSince PG error:', e.message);
        }
      }

      // Query authoritative SQLite if available
      if (sqliteDb) {
        try {
          const rows = sqliteDb
            .prepare('SELECT * FROM registrations WHERE created_at > ? ORDER BY created_at ASC LIMIT 100')
            .all(isoStr);
          if (rows && rows.length > 0) {
            return rows.map(r => ({
              id: r.ref_id,
              type: 'registration_created',
              timestamp: r.created_at,
              record: r
            }));
          }
        } catch (e) {
          console.error('[DB] getEventsSince SQLite error:', e.message);
        }
      }

      // In-memory buffer filter
      const inMemoryFiltered = recentRegistrationEvents.filter(
        ev => new Date(ev.timestamp).getTime() > sinceDate.getTime()
      );
      if (inMemoryFiltered.length > 0) {
        return inMemoryFiltered;
      }
    }
  }

  // Fallback to in-memory events or recent records from DB
  if (recentRegistrationEvents.length > 0) {
    return recentRegistrationEvents.slice(0, 50);
  }

  const latest = await getRegistrations({ sort: 'date' });
  return latest.slice(0, 50).map(r => ({
    id: r.ref_id,
    type: 'registration_created',
    timestamp: r.created_at,
    record: r
  }));
}
