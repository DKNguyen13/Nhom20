import { createClient } from 'redis';
import { config } from './env.js';

const redisClient = createClient({ url: config.redisUrl });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  await redisClient.connect();
  console.log('Redis connected');
}

connectRedis();

export default redisClient;
