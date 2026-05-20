module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-native'],
  rules: {
    // Configuración de reglas en español según solicitud
    'no-unused-vars': 'warn', // Advertencia si hay variables sin uso
    'react/prop-types': 'off', // Deshabilitar advertencias de prop-types
    'no-console': 'warn', // Advertencia para uso de console
  },
  settings: {
    react: {
      version: 'detect', // Detectar automáticamente la versión de React
    },
  },
};
