import "dotenv/config";
import { Sequelize } from "sequelize";

const db = new Sequelize({
    dialect: "mssql",
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: +process.env.DB_NAME!,
});

export default db;
