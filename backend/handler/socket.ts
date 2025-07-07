import { Server } from "socket.io";
import { Server as HttpSever } from "node:http";
import { authMiddlewareSocket } from "../api/middleware/auth";
import { getRedis } from "../database/redis";
import letterEvent from "../api/event/letterEvent";

let io: Server;

const initSocket = (server: HttpSever) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:4200",
                "https://chatflora.suprhulk.com",
                "https://project-flora-git-main-suprhulks-projects.vercel.app",
                "https://project-flora-suprhulks-projects.vercel.app",
                "https://project-flora.vercel.app",
            ],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        authMiddlewareSocket(socket, next);
    });

    io.on("connection", async (socket) => {
        await getRedis().set("_id:" + socket.user._id, "sid:" + socket.id);

        //register events
        letterEvent(io, socket);

        socket.on("disconnect", async () => {
            await getRedis().del("_id:" + socket.user._id);
        });
    });

    // Handle socket event using socket.on()
};

function getIO(): Server {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
}

export { initSocket, getIO };
