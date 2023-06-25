import * as http from "node:http";
import { MyError } from "./system";
import { ValidationError } from "sequelize";

// default error handler
const handleErrors = (
    err: unknown,
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    console.error(err);
    const error = err as MyError;
    let errMessage = error.message || "Internal Server Error";
    let statusCode = error.statusCode || 500;

    if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
    ) {
        const errorField = error.errors[0].value;
        errMessage = `Duplicate value: ${errorField}`;
        statusCode = 400;
    }
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: errMessage }));
};

export default handleErrors;
