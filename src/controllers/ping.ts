import { MyRequest, MyResponse } from "../system";

export function ping(req: MyRequest, res: MyResponse) {
    res.status(200).setHeader("Content-Type", "text/plain");
    res.end("Dogshouseservice.Version1.0.1");
}
