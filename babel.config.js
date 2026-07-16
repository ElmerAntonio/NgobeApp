module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [], // Removido reanimated hasta que se instale la dependencia
  };
};
