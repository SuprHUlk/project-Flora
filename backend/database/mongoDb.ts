import mongoose from "mongoose";
import logger from "../config/logger";

const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING || "";

async function connectMongoDB() {
    try {
        await mongoose.connect(MONGO_DB_CONNECTION_STRING);
        logger.info("MongoDB connected");
    } catch (err) {
        logger.error("MongoDB connection failed: ", { error: err });
    }
}

export default connectMongoDB;
