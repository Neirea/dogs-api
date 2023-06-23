import * as http from "node:http";
import { MyError } from "./system";

// default error handler
const handleErrors = (
    err: unknown,
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    console.log(err);
    const error = err as MyError;
    const errMessage = error.message || "Internal Server Error";
    const statusCode = error.statusCode || 500;
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errMessage }));
};

export default handleErrors;
