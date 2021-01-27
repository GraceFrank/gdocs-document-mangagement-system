require('dotenv').config();

const testConfig = {
  db: 'mongodb://localhost/gdocs_test',
  privateKey: '1234',
  redisHost: 'localhost',
  redisPort: '6379'
};

const defaultConfig = {
  db: process.env.DATABASE_URL,
  privateKey: process.env.API_PRIVATE_KEY,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT
};

module.exports = process.env.NODE_ENV === 'test' ? testConfig : defaultConfig;
