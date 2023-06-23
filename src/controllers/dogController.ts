import { Dogs } from "../models/dogs";
import { MyRequest, MyResponse } from "../system";

export const getAllDogs = async (req: MyRequest, res: MyResponse) => {
    const { attribute, order } = req.query;
    const pageNumber = +req.query.pageNumber || undefined;
    // amount of items to grab
    const limit = +req.query.limit || undefined;
    // items per page
    const pageSize = +req.query.pageSize || limit;

    // order type
    if (order && !["asc", "desc"].includes(order.toLowerCase())) {
        res.status(400).json({ message: "Invalid order type" });
        return;
    }

    if (pageNumber && pageSize == null && limit == null) {
        res.status(400).json({
            message: "Missing pageSize or limit attributes",
        });
        return;
    }
    const isValid = pageNumber && pageSize && pageNumber > 0 && pageSize > -1;
    const offset = isValid ? (pageNumber - 1) * pageSize : undefined;
    const dogs = await Dogs.findAll({
        order: attribute ? [[attribute, order || "ASC"]] : undefined,
        offset,
        limit,
    });
    res.status(200).json(dogs);
};

export const createDog = async (req: MyRequest, res: MyResponse) => {
    const { name, color, tail_length, weight } = req.body;

    // Create the dog
    const dog = await Dogs.create({ name, color, tail_length, weight });
    res.status(201).json(dog);
};
