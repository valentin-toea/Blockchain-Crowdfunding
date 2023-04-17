module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    },
  };
};
