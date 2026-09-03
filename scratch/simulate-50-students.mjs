// simulate-50-students.mjs
// Automated Concurrency & Idempotency Test for Silicon Quiz Club
import http from 'node:http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const isHttps = BASE_URL.startsWith('https');
const client = isHttps ? await import('node:https') : http;

const BRANCHES = [
  'CSE — Computer Science and Engineering',
  'ECE — Electronics and Communication Engineering',
  'ME — Mechanical Engineering',
  'CE — Civil Engineering',
  'EE — Electrical Engineering'
];

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rudra', 'Ayush',
  'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Kiara', 'Myra', 'Ira', 'Pari', 'Anushka', 'Navya',
  'Riya', 'Avani', 'Shanaya', 'Sara', 'Aditi', 'Prisha', 'Meera', 'Roshni', 'Tanvi', 'Veda',
  'Siddharth', 'Rohan', 'Kunal', 'Dev', 'Manish', 'Rahul', 'Alok', 'Deepak', 'Samir', 'Kiran'
];

function sendPost(path, body) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const data = JSON.stringify(body);
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = client.request(options, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(b) });
        } catch {
          resolve({ status: res.statusCode, raw: b });
        }
      });
    });

    req.on('error', (e) => resolve({ error: e.message }));
    req.write(data);
    req.end();
  });
}

function sendGet(path, token) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };

    const req = client.request(options, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(b) });
        } catch {
          resolve({ status: res.statusCode, raw: b });
        }
      });
    });

    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

async function run() {
  console.log(`\n🚀 STARTING 50 CONCURRENT STUDENTS SIMULATION ON: ${BASE_URL}\n`);

  // Step 1: Generate 50 unique students
  const students = Array.from({ length: 50 }, (_, i) => {
    const pad = String(i + 1).padStart(2, '0');
    return {
      name: `${FIRST_NAMES[i % FIRST_NAMES.length]} Sharma`,
      sicNo: `23BCSN${pad}`,
      branch: BRANCHES[i % BRANCHES.length],
      tenthPercentage: Number((75 + (i * 0.45)).toFixed(2)),
      twelfthPercentage: Number((78 + (i * 0.4)).toFixed(2)),
      interestedSubject: SUBJECTS[i % SUBJECTS.length],
      declarationAccepted: true
    };
  });

  console.log(`[Phase 1] Firing 50 parallel registration requests...`);
  const startTime = Date.now();

  const results = await Promise.all(
    students.map((s, idx) =>
      sendPost('/api/register', s).then((r) => ({
        index: idx + 1,
        student: s.name,
        sic: s.sicNo,
        status: r.status,
        success: r.data?.success,
        refId: r.data?.refId,
        alreadyRegistered: r.data?.alreadyRegistered
      }))
    )
  );

  const durationMs = Date.now() - startTime;
  console.log(`[Phase 1 Completed] 50 requests processed in ${durationMs}ms (~${(durationMs / 50).toFixed(1)}ms/req)\n`);

  const successful = results.filter((r) => r.status === 201 || r.status === 200);
  const failed = results.filter((r) => r.status !== 201 && r.status !== 200);

  console.log(`✅ Successful Submissions: ${successful.length} / 50`);
  if (failed.length > 0) {
    console.error(`❌ Failed Submissions: ${failed.length}`);
    failed.slice(0, 5).forEach((f) => console.error(`   Fail: ${f.sic} - Status ${f.status}`));
  }

  // Step 2: Test Idempotency & Duplicate Protection
  console.log(`\n[Phase 2] Testing duplicate submission protection (5 simultaneous requests for 23BCSN01)...`);
  const duplicateSubmissions = await Promise.all(
    Array.from({ length: 5 }, () => sendPost('/api/register', students[0]))
  );

  const allHandledSafely = duplicateSubmissions.every(
    (d) => d.status === 200 && d.data?.alreadyRegistered === true
  );
  console.log(`✅ Duplicate Protection Passed: ${allHandledSafely ? 'YES' : 'NO'}`);
  console.log(`   Sample Response:`, duplicateSubmissions[0].data?.message);

  // Step 3: Admin Console Verification
  console.log(`\n[Phase 3] Verifying Admin Console data visibility...`);
  const loginRes = await sendPost('/api/admin/login', { passkey: 'Silicon@Quiz2026' });
  if (loginRes.data?.token) {
    const adminRegs = await sendGet('/api/admin/registrations', loginRes.data.token);
    console.log(`✅ Admin Dashboard Verified: Total Records = ${adminRegs.data?.total}`);
    console.log(`   Preview First 3:`, adminRegs.data?.registrations?.slice(0, 3).map((r) => `${r.name} (${r.sic_no})`));
  } else {
    console.error(`❌ Admin Login Failed:`, loginRes);
  }

  console.log(`\n🎯 50 STUDENTS CONCURRENCY AUDIT COMPLETED.\n`);
}

run().catch(console.error);
