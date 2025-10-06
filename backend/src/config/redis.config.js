import { createClient } from 'redis';
import { config } from './env.config.js';

const redisClient = createClient({ url: config.redisUrl });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Redis connected');
    } catch (err) {
        console.error('Không thể kết nối Redis. Kiểm tra bật Redis server chưa!');
        console.error(err);
        process.exit(1);
    }
}

connectRedis();

export default redisClient;
