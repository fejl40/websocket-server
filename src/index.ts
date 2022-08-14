import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

// default port is 8080
const port = isNaN(Number(process.env.PORT)) ? 8080 : Number(process.env.PORT);

// create very simple http server
const httpServer = http.createServer();

// create socket.io server
const io = new Server(httpServer);

// handle connections
io.on("connect", (socket) => {
    // extract some data from socket connection
    const token = socket.handshake.auth.token as string;
    const username = `<socket-id:${socket.id}>`
    const lobby = io.to("lobby-name-here");

    console.log(`A user connected ${username}`);
    if (token) console.log("There is even a token!", token);

    // handle disconnect
    socket.on("disconnect", () => {
        console.log(`A user disconnected ${username}`);
    });

    // relay a string message to all sockets in the same group (there is currently only one group) "lobby-name-here"
    socket.on("relay", (msg: string) => {
        lobby.emit("relay", msg);
    });
});

// start http server on preset port
httpServer.listen(port, () => {
    console.log(`HTTP server started on port <${port}>`);
});