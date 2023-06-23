import * as http from "node:http";
import { MyError, handleRequest } from "./system";
import { db } from "./db/connect";
import routes from "./routes";
import handleErrors from "./errors";

const server = http.createServer(async (req, res) => {
    try {
        await handleRequest(req, res, routes);
    } catch (err) {
        handleErrors(err, req, res);
    }
});

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, async () => {
    try {
        // Connecting to DB
        await db.authenticate();
        console.log(`server is running on port ${PORT}...`);
    } catch (error) {
        console.log("Connection to db failed...");
        console.log(error);
        process.exit(1);
    }
});
