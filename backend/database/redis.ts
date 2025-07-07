import { Redis } from "@upstash/redis";
import logger from "../config/logger";

const UPSTASH_REDIS_CONNECTION_STRING =
    process.env.UPSTASH_REDIS_CONNECTION_STRING;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
let redis: Redis;

function connectRedis() {
    try {
        redis = new Redis({
            url: UPSTASH_REDIS_CONNECTION_STRING,
            token: UPSTASH_REDIS_REST_TOKEN,
        });

        logger.info("Redis Connected");
    } catch (err) {
        logger.error("Cannot connect to redis: ", { error: err });
    }
}

function getRedis(): Redis {
    if (!redis) {
        throw new Error("Redis not initialized!");
    }
    return redis;
}

export { connectRedis, getRedis };
