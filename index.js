"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
// Load environment variables
dotenv_1.default.config();
// default port is 8080
const port = isNaN(Number(process.env.PORT)) ? 8080 : Number(process.env.PORT);
// create very simple http server
const httpServer = http_1.default.createServer();
// create socket.io server
const io = new socket_io_1.Server(httpServer);
// handle connections
io.on("connect", (socket) => {
    // extract some data from socket connection
    const token = socket.handshake.auth.token;
    const username = `<socket-id:${socket.id}>`;
    // join group and save it for later
    const lobbyId = "lobby-name-here";
    socket.join(lobbyId);
    const lobby = io.to(lobbyId);
    console.log(`A user connected ${username}`);
    if (token)
        console.log("There is even a token!", token);
    // handle disconnect
    socket.on("disconnect", () => {
        console.log(`A user disconnected ${username}`);
    });
    // relay a string message to all sockets in the same group (there is currently only one group) "lobby-name-here"
    socket.on("relay", (msg) => {
        console.log(`A user relayed message: "${msg}"`);
        lobby.emit("relay-received", msg);
    });
});
// start http server on preset port
httpServer.listen(port, () => {
    console.log(`HTTP server started on localhost:${port}`);
});
