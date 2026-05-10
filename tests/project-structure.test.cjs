const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

test('package exposes commands to run, test, and audit the app', () => {
  const { scripts } = readJson('package.json');

  for (const script of ['start', 'android', 'ios', 'web', 'test', 'test:security', 'test:mass']) {
    assert.ok(scripts[script], `Missing npm script: ${script}`);
  }

  assert.match(scripts.test, /node --test/);
  assert.match(scripts['test:security'], /npm audit/);
});

test('core app files are present', () => {
  for (const file of [
    'App.js',
    'src/navigation/AppNavigator.js',
    'src/screens/LoginScreen.js',
    'src/screens/DashboardScreen.js',
    'src/screens/ContributeScreen.js',
    'src/screens/ExploreScreen.js',
    'src/screens/ProfileScreen.js',
    'src/components/NgobeTriangle.js',
    'src/utils/theme.js',
    'src/utils/validation.js',
    'supabase/schema.sql',
    'supabase/security_patch.sql',
  ]) {
    assert.ok(exists(file), `Missing expected file: ${file}`);
  }
});

test('README documents setup and testing commands', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

  assert.match(readme, /npm install/);
  assert.match(readme, /npm run start/);
  assert.match(readme, /npm run test:mass/);
});
