import { createClient, RedisClientType } from "redis";
import logger from "../config/logger";

// UPSTASH keyword is a legacy term
// currently using azure managed redis
const UPSTASH_REDIS_CONNECTION_STRING =
    process.env.UPSTASH_REDIS_CONNECTION_STRING;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

class Redis {
    private static _instance: Redis;
    private redisClient: RedisClientType;

    private constructor(redisClient: RedisClientType) {
        this.redisClient = redisClient;
    }

    static async getInstance(): Promise<Redis> {
        if (!Redis._instance) {
            await Redis.connectRedis();
        }
        return Redis._instance;
    }

    private static async connectRedis() {
        try {
            if (Redis._instance) {
                return;
            }
            const redisClient: RedisClientType = createClient({
                url: UPSTASH_REDIS_CONNECTION_STRING,
                password: UPSTASH_REDIS_REST_TOKEN,
            });

            await redisClient.connect();
            Redis._instance = new Redis(redisClient);
            logger.info("Redis Connected");
        } catch (err) {
            logger.error("Cannot connect to redis: ", { error: err });
            throw err;
        }
    }

    async set(key: string, value: string) {
        await this.redisClient.set(key, value);
    }

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async del(key: string) {
        await this.redisClient.del(key);
    }
}

export default Redis;
