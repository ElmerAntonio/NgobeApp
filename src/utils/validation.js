const AUTH_PASSWORD_MIN_LENGTH = 8;

const CONTRIBUTION_CATEGORIES = ['Palabra', 'Frase', 'Cuento', 'Canción'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email) {
  return EMAIL_PATTERN.test(normalizeField(email).toLowerCase());
}

function validateAuthForm({ email, password, isLogin = true, acceptedTerms = false }) {
  const cleanEmail = normalizeField(email);

  if (!cleanEmail || !password) {
    return {
      isValid: false,
      title: 'Error',
      message: 'Por favor ingresa correo y contraseña.',
    };
  }

  if (!isValidEmail(cleanEmail)) {
    return {
      isValid: false,
      title: 'Correo inválido',
      message: 'Ingresa un correo electrónico válido.',
    };
  }

  if (!isLogin && password.length < AUTH_PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      title: 'Contraseña débil',
      message: `La contraseña debe tener al menos ${AUTH_PASSWORD_MIN_LENGTH} caracteres.`,
    };
  }

  if (!isLogin && !acceptedTerms) {
    return {
      isValid: false,
      title: 'Consentimiento requerido',
      message: 'Debes aceptar la política de privacidad y los términos antes de registrarte.',
    };
  }

  return {
    isValid: true,
    title: null,
    message: null,
  };
}

function validateContribution({ category, ngobeText, spanishText, region, recordings = {} }) {
  const cleanNgobeText = normalizeField(ngobeText);
  const cleanSpanishText = normalizeField(spanishText);
  const cleanRegion = normalizeField(region);

  if (!CONTRIBUTION_CATEGORIES.includes(category)) {
    return {
      isValid: false,
      title: 'Categoría inválida',
      message: 'Selecciona una categoría válida para el aporte.',
      warnings: [],
    };
  }

  if (!cleanNgobeText || !cleanSpanishText) {
    return {
      isValid: false,
      title: 'Faltan datos',
      message: 'Por favor completa los campos de texto.',
      warnings: [],
    };
  }

  if (!cleanRegion) {
    return {
      isValid: false,
      title: 'Falta la región',
      message: 'Indica la región o dialecto relacionado con el aporte.',
      warnings: [],
    };
  }

  const warnings = [];
  if (!recordings.lento || !recordings.rapido) {
    warnings.push('El aporte queda más completo si incluye audio lento y natural.');
  }

  return {
    isValid: true,
    title: null,
    message: null,
    warnings,
  };
}

module.exports = {
  AUTH_PASSWORD_MIN_LENGTH,
  CONTRIBUTION_CATEGORIES,
  isValidEmail,
  normalizeField,
  validateAuthForm,
  validateContribution,
};
