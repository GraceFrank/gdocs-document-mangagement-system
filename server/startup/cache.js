//
import redis from 'redis';
import logger from './logger';
import util from 'util';

const client = redis.createClient({ host: 'redis' });
client.hget = util.promisify(client.hget);
client.hset = util.promisify(client.hset);
client.hdel = util.promisify(client.hdel);
client.del = util.promisify(client.del);
client.hexists = util.promisify(client.hexists);

function connectToRedis() {
  client.on('connect', () => logger.info('connected to redis cache'));
  client.on('error', err => logger.info(err));
}

export { client, connectToRedis };
