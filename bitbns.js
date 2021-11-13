const bitbnsApi = require('bitbns');
require('dotenv').config()
const bitbns = new bitbnsApi({
      apiKey :  process.env.BITBNS_KEY,
      apiSecretKey : process.env.BITBNS_SECRET
});

module.exports = bitbns;