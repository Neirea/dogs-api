import { DataTypes } from "sequelize";
import { db } from "../db/connect";

const Dogs = db.define(
    "Dogs",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [2, 30],
            },
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^(\w+&)*\w+$/i, //check for format: red&black
            },
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
            validate: {
                min: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

export { Dogs };
