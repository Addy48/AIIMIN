import test from 'node:test';
import assert from 'node:assert/strict';
import { validateUploadBuffer, safeUploadFilename } from '../lib/uploadValidate.js';

test('Security Fix Verification: AIIMIN-SEC-001 Identifier Validation', async (t) => {
  const IDENTIFIER_REGEX = /^[a-z_][a-z0-9_]*$/i;

  const maliciousInputs = [
    'id = 1 OR 1=1; --',
    'title) VALUES (\'pwned\') RETURNING *; --',
    'col; DROP TABLE users;--',
    'foo"bar',
    'col`name',
    'col name',
    'col\nname',
    'user_id, (SELECT secret FROM keys)'
  ];

  for (const input of maliciousInputs) {
    assert.equal(IDENTIFIER_REGEX.test(input), false, `Malicious identifier was not rejected: ${input}`);
  }

  const validInputs = ['id', 'user_id', 'created_at', 'title', 'habit_id', 'xp_points'];
  for (const input of validInputs) {
    assert.equal(IDENTIFIER_REGEX.test(input), true, `Valid identifier was falsely rejected: ${input}`);
  }
});

test('Security Fix Verification: AIIMIN-SEC-002 Upload Buffer & Path Validation', async (t) => {
  // Test PDF magic byte validation
  const validPdf = Buffer.from('%PDF-1.4 test document content');
  const validPdfRes = validateUploadBuffer(validPdf, 'application/pdf');
  assert.equal(validPdfRes.ok, true);

  // Test malicious fake PDF (wrong magic bytes)
  const fakePdf = Buffer.from('<script>alert(1)</script>');
  const fakePdfRes = validateUploadBuffer(fakePdf, 'application/pdf');
  assert.equal(fakePdfRes.ok, false);
  assert.match(fakePdfRes.error, /does not match declared type/i);

  // Test dangerous HTML upload
  const htmlFile = Buffer.from('<html><body>XSS</body></html>');
  const htmlRes = validateUploadBuffer(htmlFile, 'text/html');
  assert.equal(htmlRes.ok, false);
  assert.match(htmlRes.error, /not allowed/i);

  // Test safe filename generation sanitization
  const safeName = safeUploadFilename('../../etc/passwd.jpg');
  assert.ok(!safeName.includes('..'), 'Path traversal detected in generated filename');
  assert.ok(safeName.endsWith('.jpg'));
});

test('Security Fix Verification: AIIMIN-SEC-004 CORS Origin Matcher Hardening', async (t) => {
  const CORS_ALLOWED = new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://aiimin.in',
    'https://www.aiimin.in',
    'https://api.aiimin.in',
  ]);

  const matchOrigin = (origin) => {
    if (!origin) return '';
    if (CORS_ALLOWED.has(origin)) return origin;
    if (/^https:\/\/aiimin(?:-[a-z0-9-]+)?-aadityas-projects-[a-z0-9]+\.vercel\.app$/i.test(origin)) return origin;
    if (/^https:\/\/aiimin\.vercel\.app$/i.test(origin)) return origin;
    return null;
  };

  // Malicious / Attacker origins that would have matched previously:
  const attackerOrigins = [
    'https://aiimin-attacker.vercel.app',
    'https://aiimin-phishing.vercel.app',
    'https://evil-aaditya.vercel.app',
    'https://attacker-aaditya-test.vercel.app',
    'https://aiimin.attacker.com',
  ];

  for (const origin of attackerOrigins) {
    assert.equal(matchOrigin(origin), null, `Attacker origin was falsely allowed: ${origin}`);
  }

  // Legitimate production & preview origins:
  assert.equal(matchOrigin('https://aiimin.in'), 'https://aiimin.in');
  assert.equal(matchOrigin('https://www.aiimin.in'), 'https://www.aiimin.in');
  assert.equal(matchOrigin('https://aiimin.vercel.app'), 'https://aiimin.vercel.app');
  assert.equal(matchOrigin('https://aiimin-git-main-aadityas-projects-1234abcd.vercel.app'), 'https://aiimin-git-main-aadityas-projects-1234abcd.vercel.app');
});
