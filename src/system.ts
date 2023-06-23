import * as http from "node:http";
import * as qs from "node:querystring";

export interface MyRequest extends http.IncomingMessage {
    body: any;
    query: any;
}
export interface MyResponse extends http.ServerResponse {
    status: (statusCode: number) => MyResponse;
    json: (json: Object) => void;
}

export class MyError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export interface Routes {
    [key: string]: {
        [key: string]: Function;
    };
}

const getBody = (req: http.IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let bodyChunks: Buffer[] = [];

        req.on("data", (chunk: Buffer) => {
            bodyChunks.push(chunk);
        });

        req.on("end", () => {
            const body = Buffer.concat(bodyChunks).toString();
            resolve(body);
        });

        req.on("error", (error: Error) => {
            reject(error);
        });
    });
};

// our app only expects json body
const parseJsonBody = (req: MyRequest, res: MyResponse, body: string) => {
    if (!body) return {};
    let parsedBody;

    // ideally would check for Content-Type here
    // but we'll accept any if it's JSON parseable

    // parsing JSON body
    try {
        parsedBody = JSON.parse(body.toString());
    } catch (error) {
        throw new MyError(400, "Failed to parse body");
    }
    return parsedBody;
};

const parseQueryParams = (parseString: string) => {
    const params = qs.parse(parseString);
    return { ...params };
};

const handleRoutes = async (
    req: MyRequest,
    res: MyResponse,
    routes: Routes
) => {
    const method = req.method || "GET";
    //handle preflight requests
    if (method === "OPTIONS") {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }

    const url = req.url || "/";
    const routeUrl = url!.split("?")[0];

    const reqController = routes[method][routeUrl];

    if (!reqController) {
        res.status(404).end();
        return;
    }

    // Handle request timeout
    const REQUEST_TIMEOUT_MS = 5000;
    const timeoutId = setTimeout(() => {
        res.status(408).json({ message: "Request timeout" });
    }, REQUEST_TIMEOUT_MS);

    // execute route controller
    await reqController(req, res);
    clearTimeout(timeoutId);
};

/* mixin to our request and response objects */
const addData = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const request = req as MyRequest;
    const response = res as MyResponse;
    response.status = function (status) {
        if (status < 100 || status > 599) {
            throw new MyError(500, "Invalid status code");
        }
        this.statusCode = status;
        return this;
    };
    response.json = function (object) {
        const returnValue = JSON.stringify(object);
        const status = this.statusCode || 200;
        this.writeHead(status, { "Content-Type": "application/json" });
        this.end(returnValue);
    };

    const url = request.url || "/";
    const queryParamString = url!.split("?")[1];

    const query = parseQueryParams(queryParamString);
    const rawBody = await getBody(request);
    const body = parseJsonBody(request, response, rawBody);
    request.body = body;
    request.query = query;

    return { req: request, res: response };
};

// errors are propagated to user
export const handleRequest = async (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    routes: Routes
) => {
    const { req, res } = await addData(request, response);
    await handleRoutes(req, res, routes);
};
