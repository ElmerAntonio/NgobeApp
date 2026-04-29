module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [], // Removido reanimated hasta que se instale la dependencia
  };
};
