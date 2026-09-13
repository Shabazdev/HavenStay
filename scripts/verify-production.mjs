/**
 * Production verification for https://haven-stay-one.vercel.app
 * Exercises the REAL flows a browser performs:
 *   ping → health → get-session → properties → sign-up → session → sign-out → sign-in → session
 */
const BASE = process.argv[2] || 'https://havenstay-ten.vercel.app';
const EMAIL = `verify-${Date.now()}@example.com`;
const PASSWORD = 'VerifyMe!2026Pass';

let failures = 0;
function check(name, ok, extra = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);
  if (!ok) failures += 1;
}
function cookieFrom(res) {
  return (res.headers.getSetCookie?.() || []).map((c) => c.split(';')[0]).filter((c) => c.includes('=')).join('; ');
}

const res1 = await fetch(`${BASE}/api/ping`);
check('GET /api/ping', res1.ok, JSON.stringify(await res1.json().catch(() => null)));

const res2 = await fetch(`${BASE}/api/health`);
const h = await res2.json().catch(() => null);
check('GET /api/health', res2.ok && h?.status === 'ok', `persistence=${h?.authPersistence}`);

const res3 = await fetch(`${BASE}/api/auth/get-session`);
const s3 = await res3.json().catch(() => null);
check('GET /api/auth/get-session (anonymous)', res3.ok, `body=${JSON.stringify(s3)?.slice(0, 60)}`);

const res4 = await fetch(`${BASE}/api/properties?sort=newest&page=1&limit=9&status=approved`);
const p = await res4.json().catch(() => null);
check('GET /api/properties?...status=approved', res4.ok && p?.success === true, `status=${res4.status}`);
check('approved property cards returned', Array.isArray(p?.properties) && p.properties.length > 0, `count=${p?.properties?.length}`);
check('pagination shape', p?.pagination?.totalPages >= 1, JSON.stringify(p?.pagination));
check('all returned are approved', (p?.properties || []).every((x) => x.status === 'approved'));

const res5 = await fetch(`${BASE}/api/auth/sign-up/email`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin: BASE },
  body: JSON.stringify({ name: 'Verify User', email: EMAIL, password: PASSWORD }),
});
const su = await res5.json().catch(() => null);
check('POST /api/auth/sign-up/email', res5.ok && Boolean(su?.user?.id), `status=${res5.status} err=${su?.message || su?.code || ''}`);
let cookie = cookieFrom(res5);
check('sign-up set session cookie', cookie.length > 0, cookie.slice(0, 40));

const res6 = await fetch(`${BASE}/api/auth/get-session`, { headers: { cookie } });
const s6 = await res6.json().catch(() => null);
check('session persists after sign-up', s6?.user?.email === EMAIL, `email=${s6?.user?.email}`);

const res7 = await fetch(`${BASE}/api/auth/sign-out`, { method: 'POST', headers: { 'content-type': 'application/json', origin: BASE, cookie } });
check('POST /api/auth/sign-out', res7.ok, `status=${res7.status}`);

const res8 = await fetch(`${BASE}/api/auth/sign-in/email`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin: BASE },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
});
const si = await res8.json().catch(() => null);
check('POST /api/auth/sign-in/email (same credentials)', res8.ok && Boolean(si?.user?.id), `status=${res8.status}`);
cookie = cookieFrom(res8) || cookie;

const res9 = await fetch(`${BASE}/api/auth/get-session`, { headers: { cookie } });
const s9 = await res9.json().catch(() => null);
check('session persists after sign-in', s9?.user?.email === EMAIL);

console.log(failures === 0 ? '\nPRODUCTION VERIFICATION: ALL PASSED' : `\nPRODUCTION VERIFICATION: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);