import { createDog, getAllDogs } from "./controllers/dogs";
import { ping } from "./controllers/ping";
import { Routes } from "./system";

const routes: Routes = {
    "/ping": {
        GET: ping,
    },
    "/dogs": {
        GET: getAllDogs,
    },
    "/dog": {
        POST: createDog,
    },
};
export default routes;
