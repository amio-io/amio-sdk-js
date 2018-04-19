const forEachObjIndexed = require('ramda/src/forEachObjIndexed')

// we set config for amio+sdk_tests@amio.io in prod
const config = {
  CONNECTOR_ACCESS_TOKEN: process.env.CONNECTOR_ACCESS_TOKEN,
  CONNECTOR_CHANNEL_ID: process.env.CONNECTOR_CHANNEL_ID,
  CONNECTOR_CONTACT_ID: process.env.CONNECTOR_CONTACT_ID
}

forEachObjIndexed((value, key) => {
  if(!value) {
    const message = `All config values must be set so that tests can run. ${key} is missing.`;
    console.error(message)
    throw new Error(message)
  }
}, config)

module.exports = config
