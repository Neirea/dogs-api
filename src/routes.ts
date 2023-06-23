import { createDog, getAllDogs } from "./controllers/dogs";
import { ping } from "./controllers/ping";
import { Routes } from "./system";

const routes: Routes = {
    GET: {
        "/ping": ping,
        "/dogs": getAllDogs,
    },
    POST: {
        "/dog": createDog,
    },
};
export default routes;
