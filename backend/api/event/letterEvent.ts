import { Server, Socket } from "socket.io";
import { ILetterRequest } from "../../model/letterModel";
import logger from "../../config/logger";
import { send as sendController } from "../controller/letterController";

function letterEvent(io: Server, socket: Socket) {
    socket.on("letter:send", (letter: ILetterRequest) => {
        send(letter, io, socket);
    });
    // socket.on("letter:reSend", reSend);
}

function send(letter: ILetterRequest, io: Server, socket: Socket) {
    // sendController(letter, socket.user, io);
}

export default letterEvent;
