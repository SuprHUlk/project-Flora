import { createClient, RedisClientType } from "redis";
import logger from "../config/logger";

// UPSTASH keyword is a legacy term
// currently using azure managed redis
const UPSTASH_REDIS_CONNECTION_STRING =
    process.env.UPSTASH_REDIS_CONNECTION_STRING;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis;

class Redis {
    redisClient: RedisClientType;

    constructor(redisClient: RedisClientType) {
        this.redisClient = redisClient;
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

function connectRedis() {
    try {
        if (redis) {
            return;
        }
        let redisClient: RedisClientType = createClient({
            url: UPSTASH_REDIS_CONNECTION_STRING,
            password: UPSTASH_REDIS_REST_TOKEN,
        });

        redis = new Redis(redisClient);
    } catch (err) {
        logger.error("Cannot connect to redis: ", { error: err });
    }
}

async function getRedis() {
    if (!redis) {
        connectRedis();
    }
    return redis;
}

export { connectRedis, getRedis };
