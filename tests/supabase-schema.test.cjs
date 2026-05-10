const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const schema = fs.readFileSync(path.resolve(__dirname, '..', 'supabase/schema.sql'), 'utf8');
const patch = fs.readFileSync(path.resolve(__dirname, '..', 'supabase/security_patch.sql'), 'utf8');

test('contributions table has RLS and ownership metadata', () => {
  assert.match(schema, /ALTER TABLE contributions ENABLE ROW LEVEL SECURITY/i);
  assert.match(schema, /user_id UUID NOT NULL DEFAULT auth\.uid\(\)/i);
  assert.match(schema, /REFERENCES auth\.users\(id\) ON DELETE CASCADE/i);
});

test('contribution policies avoid public reads and ownerless inserts', () => {
  assert.doesNotMatch(schema, /USING\s*\(\s*true\s*\)/i);
  assert.match(schema, /Users can read approved contributions/);
  assert.match(schema, /Users can read own contributions/);
  assert.match(schema, /Users can insert own contributions/);
  assert.match(schema, /WITH CHECK \(auth\.uid\(\) = user_id\)/);
});

test('audio bucket is private and readable only by authenticated users', () => {
  assert.match(schema, /VALUES \('audios', 'audios', false\)/);
  assert.match(schema, /Allow authenticated read from audios/);
  assert.match(schema, /bucket_id = 'audios' AND auth\.role\(\) = 'authenticated'/);
});

test('security patch removes older permissive policies', () => {
  assert.match(patch, /DROP POLICY IF EXISTS "Allow public read access"/);
  assert.match(patch, /DROP POLICY IF EXISTS "Allow authenticated insert"/);
  assert.match(patch, /UPDATE storage\.buckets SET public = false/);
});
