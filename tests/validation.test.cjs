const assert = require('node:assert/strict');
const test = require('node:test');

const {
  AUTH_PASSWORD_MIN_LENGTH,
  CONTRIBUTION_CATEGORIES,
  isValidEmail,
  normalizeField,
  validateAuthForm,
  validateContribution,
} = require('../src/utils/validation');

test('normalizeField trims strings and protects non-string values', () => {
  assert.equal(normalizeField('  Ngäbe  '), 'Ngäbe');
  assert.equal(normalizeField(null), '');
  assert.equal(normalizeField(undefined), '');
});

test('isValidEmail accepts common emails and rejects malformed values', () => {
  assert.equal(isValidEmail('maestro@comarca.pa'), true);
  assert.equal(isValidEmail(' maestro@comarca.pa '), true);
  assert.equal(isValidEmail('maestro@comarca'), false);
  assert.equal(isValidEmail('maestro comarca.pa'), false);
});

test('login validation requires only usable credentials', () => {
  assert.equal(validateAuthForm({ email: '', password: '' }).isValid, false);
  assert.equal(validateAuthForm({ email: 'mal', password: '123' }).isValid, false);
  assert.equal(
    validateAuthForm({ email: 'maestro@comarca.pa', password: '123', isLogin: true }).isValid,
    true
  );
});

test('registration validation enforces password strength and consent', () => {
  const weakPassword = validateAuthForm({
    email: 'maestro@comarca.pa',
    password: '123',
    isLogin: false,
    acceptedTerms: true,
  });

  assert.equal(weakPassword.isValid, false);
  assert.match(weakPassword.message, new RegExp(String(AUTH_PASSWORD_MIN_LENGTH)));

  const missingConsent = validateAuthForm({
    email: 'maestro@comarca.pa',
    password: '12345678',
    isLogin: false,
    acceptedTerms: false,
  });

  assert.equal(missingConsent.isValid, false);
  assert.match(missingConsent.title, /Consentimiento/);

  assert.equal(
    validateAuthForm({
      email: 'maestro@comarca.pa',
      password: '12345678',
      isLogin: false,
      acceptedTerms: true,
    }).isValid,
    true
  );
});

test('contribution categories stay aligned with the app workflow', () => {
  assert.deepEqual(CONTRIBUTION_CATEGORIES, ['Palabra', 'Frase', 'Cuento', 'Canción']);
});

test('contribution validation blocks incomplete or invalid data', () => {
  assert.equal(
    validateContribution({
      category: 'Video',
      ngobeText: 'Kri',
      spanishText: 'Árbol',
      region: 'General',
    }).isValid,
    false
  );

  assert.equal(
    validateContribution({
      category: 'Palabra',
      ngobeText: '',
      spanishText: 'Árbol',
      region: 'General',
    }).isValid,
    false
  );

  assert.equal(
    validateContribution({
      category: 'Palabra',
      ngobeText: 'Kri',
      spanishText: 'Árbol',
      region: '   ',
    }).isValid,
    false
  );
});

test('contribution validation accepts complete text data and warns about missing audio', () => {
  const validation = validateContribution({
    category: 'Palabra',
    ngobeText: 'Kri',
    spanishText: 'Árbol',
    region: 'General',
    recordings: { lento: null, rapido: null },
  });

  assert.equal(validation.isValid, true);
  assert.equal(validation.warnings.length, 1);

  assert.equal(
    validateContribution({
      category: 'Frase',
      ngobeText: 'Ti tä kweri',
      spanishText: 'Yo estoy bien',
      region: 'Ñö Kribo',
      recordings: { lento: 'file://lento.m4a', rapido: 'file://rapido.m4a' },
    }).warnings.length,
    0
  );
});
