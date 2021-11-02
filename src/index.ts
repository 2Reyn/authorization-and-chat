import Express from 'express';
import HTTP from 'http';
import IO from 'socket.io';
import { Logs } from './utils/logs';

const PORT = 3000

const app = Express();
const server = HTTP.createServer(app);
const io = new IO.Server(server, {
    cors: {
        origin: '*',
    }
});

async function start() {
    app.use("/auth", require("./routes/auth"))
    server.listen(PORT, () => {Logs.info(`Server listening on port ${PORT}`)})
}

start().catch(Logs.error)