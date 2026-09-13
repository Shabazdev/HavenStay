/**
 * Local end-to-end smoke test for the HavenStay API.
 *
 * Builds nothing itself — it expects `npm run build` output at dist/server.cjs
 * and then exercises the REAL Express app the way a browser would:
 *
 *   sign-up → get-session → sign-out → sign-in → get-session → properties → health
 *
 * Usage:  node scripts/smoke.mjs
 * Exits non-zero if any assertion fails.
 */
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const PORT = 3999;
const BASE = `http://127.0.0.1:${PORT}`;
const TEST_EMAIL = `smoke-${Date.now()}@example.com`;
const TEST_PASSWORD = 'SmokeTestPass!123';

let failures = 0;
function check(name, ok, extra = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);
  if (!ok) failures += 1;
}

function extractCookies(res) {
  return (res.headers.getSetCookie?.() || [])
    .map((c) => c.split(';')[0])
    .filter((c) => c.includes('='))
    .join('; ');
}

async function api(path, options = {}) {
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      origin: `http://localhost:${PORT}`,
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
}

const server = spawn('node', ['dist/server.cjs'], {
  env: {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: 'production',
    MONGODB_URI: '',
    BETTER_AUTH_URL: `http://localhost:${PORT}`,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || 'local-smoke-test-secret-0123456789abcdef',
    BETTER_AUTH_ADMIN_EMAIL: '',
    BETTER_AUTH_ADMIN_PASSWORD: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});

server.stdout.on('data', (d) => process.stdout.write(`[server] ${d}`));
server.stderr.on('data', (d) => process.stderr.write(`[server:err] ${d}`));

try {
  // Wait for the server to be ready.
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${BASE}/api/health`);
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  check('server started', ready);
  if (!ready) throw new Error('server never became ready');

  // 1. sign-up
  let res = await api('/api/auth/sign-up/email', {
    method: 'POST',
    body: JSON.stringify({ name: 'Smoke Tester', email: TEST_EMAIL, password: TEST_PASSWORD }),
  });
  const signUpBody = await res.json();
  check('sign-up returns 2xx', res.ok, `status=${res.status}`);
  check('sign-up created user/session', Boolean(signUpBody?.user?.id));
  let cookie = extractCookies(res);
  check('sign-up set session cookie', Boolean(cookie.includes('havenstay.')), cookie.slice(0, 60));
  if (!cookie) throw new Error('no cookie after sign-up');

  // 2. get-session with the sign-up cookie
  res = await api('/api/auth/get-session', { headers: { cookie } });
  const sessionBody = await res.json();
  check('get-session (after sign-up)', sessionBody?.user?.email === TEST_EMAIL, JSON.stringify(sessionBody).slice(0, 160));

  // 3. sign-out
  res = await api('/api/auth/sign-out', { method: 'POST', headers: { cookie } });
  const signOutBody = await res.json();
  check('sign-out returns 2xx', res.ok, `status=${res.status}, success=${signOutBody?.success}`);

  // 4. sign-in with the exact same credentials (this flow failed in production)
  res = await api('/api/auth/sign-in/email', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });
  const signInBody = await res.json();
  check('sign-in returns 2xx', res.ok, `status=${res.status}`);
  check('sign-in returned user', Boolean(signInBody?.user?.id));
  if (res.ok) cookie = extractCookies(res) || cookie;

  // 5. get-session again with the sign-in cookie
  res = await api('/api/auth/get-session', { headers: { cookie } });
  const postSessionBody = await res.json();
  check('get-session after sign-in', postSessionBody?.user?.email === TEST_EMAIL, JSON.stringify(postSessionBody).slice(0, 160));

  // 6. properties listing exactly as the frontend calls it
  res = await api('/api/properties?sort=newest&page=1&limit=9&status=approved');
  const propsBody = await res.json();
  check('properties returns 2xx + success', res.ok && propsBody?.success === true, `status=${res.status}`);
  check('properties has approved cards', Array.isArray(propsBody?.properties) && propsBody.properties.length > 0, `count=${propsBody?.properties?.length}`);
  check('pagination shape', propsBody?.pagination?.totalPages >= 1, JSON.stringify(propsBody?.pagination));

  // 7. featured
  res = await api('/api/properties/featured');
  const featuredBody = await res.json();
  check('featured properties', featuredBody?.success === true && Array.isArray(featuredBody?.properties), `count=${featuredBody?.properties?.length}`);

  // 8. health
  res = await api('/api/health');
  const healthBody = await res.json();
  check('health returns ok', healthBody?.status === 'ok', `authPersistence=${healthBody?.authPersistence ?? 'memory'}`);
} finally {
  server.kill();
  await once(server, 'exit').catch(() => undefined);
}

console.log(failures === 0 ? '\nSMOKE TEST: ALL PASSED' : `\nSMOKE TEST: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);