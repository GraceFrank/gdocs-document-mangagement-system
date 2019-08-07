//
const redis = require('redis');
const logger = require('./logger');
const util = require('util');
const config = require('../../config/default');

const redisClient = redis.createClient({
  host: config.redisHost,
  port: config.redisPort
});

function connectToRedis() {
  redisClient.on('connect', () => logger.info('connected to redis server'));
  redisClient.on('error', err => logger.error(err));
}

module.exports = { redisClient, connectToRedis };
