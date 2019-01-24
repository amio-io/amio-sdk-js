const forEachObjIndexed = require('ramda/src/forEachObjIndexed')

const config = {
  AMIO_ACCESS_TOKEN: process.env.AMIO_ACCESS_TOKEN,
  AMIO_CHANNEL_ID: process.env.AMIO_CHANNEL_ID,
  AMIO_CONTACT_ID: process.env.AMIO_CONTACT_ID
}

forEachObjIndexed((value, key) => {
  if(!value) {
    const message = `All config values must be set so that tests can run. ${key} is missing.`;
    console.error(message)
    throw new Error(message)
  }
}, config)

module.exports = config
