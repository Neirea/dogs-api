import "dotenv/config";
import { Sequelize } from "sequelize";

class Database {
    private static instance: Sequelize | undefined;
    static getInstance() {
        if (Database.instance) {
            return Database.instance;
        }
        Database.instance = new Sequelize({
            dialect: "mssql",
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: +process.env.DB_NAME!,
        });
        return Database.instance;
    }
}

const db = Database.getInstance();

export { db };
