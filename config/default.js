require('dotenv').config()
module.exports = {
  "db": process.env.DATABASE_URL,
  "privateKey": process.env.API_PRIVATE_KEY,
  "redisHost": process.env.REDIS_HOST,
  "redisPort": process.env.REDIS_PORT
}
