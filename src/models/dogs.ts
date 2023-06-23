import { DataTypes } from "sequelize";
import { db } from "../db/connect";

const Dogs = db.define(
    "Dogs",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tail_length: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

export { Dogs };
