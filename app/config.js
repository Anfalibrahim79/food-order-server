const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  secretkey: process.env.SECRET_KEY,
  serviceName: process.env.SERVICE_NAME,
  dbUri: process.env.DB_URI,
  dbPassword: process.env.DB_PASSWORD,
  cloudName: process.env.CLOUD_NAME,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
}