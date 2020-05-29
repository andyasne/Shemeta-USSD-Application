const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Shemeta_USSD_Application API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/andyasne/Shemeta_USSD_Application/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
