import { Dogs } from "../models/dogs";
import { MyRequest, MyResponse } from "../system";

export const getAllDogs = async (req: MyRequest, res: MyResponse) => {
    const { attribute, order } = req.query;
    const pageNumber = +req.query.pageNumber || undefined;
    // amount of items to grab
    const limit = +req.query.limit || undefined;
    // items per page
    const pageSize = +req.query.pageSize || limit;

    if (limit && limit < 0) {
        res.status(400).json({ message: "Limit can't be negative" });
        return;
    }

    // check for valid attribute
    const attrs = Object.keys(Dogs.getAttributes());
    if (attribute && !attrs.includes(attribute)) {
        res.status(400).json({ message: "Wrong attribute name" });
        return;
    }

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

    // Validate name
    if (!name || name.length < 2) {
        res.status(400).json({ message: "Invalid name" });
        return;
    }
    // Validate color - Can add color validation if we know all existing colors
    if (!color) {
        res.status(400).json({ message: "Color is missing" });
        return;
    }

    // Validate tail_length
    if (typeof tail_length !== "number" || tail_length < 0) {
        res.status(400).json({ message: "Invalid tail_length" });
        return;
    }
    // Validate weight
    if (typeof weight !== "number" || weight < 0) {
        res.status(400).json({ message: "Invalid weight" });
        return;
    }

    // Create the dog
    try {
        const dog = await Dogs.create({ name, color, tail_length, weight });
        res.status(201).json(dog);
    } catch (error) {
        if ((error as Error).name === "SequelizeUniqueConstraintError") {
            res.status(400).json({
                error: "Dog with the same name already exists",
            });
        } else {
            //propagate to handler
            throw error;
        }
    }
};
