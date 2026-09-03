import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'quizclub.db');
const jsonPath = path.join(dataDir, 'registrations.json');

// 1. Reset JSON file to empty array
fs.writeFileSync(jsonPath, JSON.stringify([], null, 2), 'utf-8');
console.log('[OK] Reset registrations.json to empty list');

// 2. Clear SQLite database
try {
  if (fs.existsSync(dbPath)) {
    const db = new DatabaseSync(dbPath);
    db.exec('DELETE FROM registrations;');
    try {
      db.exec("DELETE FROM sqlite_sequence WHERE name='registrations';");
    } catch {}
    db.close();
    console.log('[OK] Cleared all rows from quizclub.db registrations table');
  }
} catch (e) {
  console.error('[Error] SQLite clear:', e);
}

// 3. Verify
const { getRegistrations } = await import('../server/db.js');
const current = getRegistrations();
console.log(`[VERIFY] Total registrations in system now: ${current.length}`);
