const config = {
  CONNECTOR_API_BASE_URL: process.env.CONNECTOR_API_BASE_URL || 'https://api.amio.io',
  CONNECTOR_ACCESS_TOKEN: process.env.CONNECTOR_ACCESS_TOKEN,
  CONNECTOR_CHANNEL_ID: process.env.CONNECTOR_CHANNEL_ID,
  CONNECTOR_CONTACT_ID: process.env.CONNECTOR_CONTACT_ID
}

module.exports = config
