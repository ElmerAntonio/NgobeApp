const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const migration = fs.readFileSync(path.resolve(__dirname, '..', 'supabase/migration_fase2.sql'), 'utf8');

test('migration adds transcripcion_fonetica and metadatos_linguisticos columns', () => {
  assert.match(migration, /ALTER TABLE contributions ADD COLUMN IF NOT EXISTS transcripcion_fonetica TEXT/i);
  assert.match(migration, /ALTER TABLE contributions ADD COLUMN IF NOT EXISTS metadatos_linguisticos JSONB/i);
});

test('migration defines is_maestro_or_admin function', () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.is_maestro_or_admin\(\)/i);
  assert.match(migration, /SELECT rol, estado INTO user_role, user_status FROM public\.profiles/i);
  assert.match(migration, /RETURN COALESCE\(user_role IN \('maestro', 'superadmin'\) AND user_status = 'aprobado'/i);
});

test('migration defines update and select policies for teachers and admins', () => {
  assert.match(migration, /CREATE POLICY "Maestros and admins can update contributions" ON contributions/i);
  assert.match(migration, /USING \(public\.is_maestro_or_admin\(\)\)/i);
  assert.match(migration, /CREATE POLICY "Maestros and admins can read all contributions" ON contributions/i);
});
