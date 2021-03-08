const path = require('path');
module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@app': path.resolve(__dirname, 'src/app'),
      '@services': path.resolve(__dirname, 'src/app/shared/services'),
      '@utilities': path.resolve(__dirname, 'src/app/shared/utils'),
      '@components': path.resolve(__dirname, 'src/app/components/'),
      '@interfaces': path.resolve(__dirname, 'src/shared/interfaces'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  };
  return config;
};
