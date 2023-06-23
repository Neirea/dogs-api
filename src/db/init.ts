import { db } from "./connect";
import { Dogs } from "../models/dogs";

// Data to insert
const dogsData = [
    { name: "Neo", color: "red & amber", tail_length: 22, weight: 32 },
    { name: "Jessy", color: "black & white", tail_length: 7, weight: 14 },
];

(async () => {
    try {
        // Synchronize the model with the database
        await Dogs.sync({ force: true });

        // Insert the data into the 'dogs' table
        await Dogs.bulkCreate(dogsData);

        console.log("Data inserted successfully.");
        db.close();
    } catch (error) {
        console.error("Error occurred:", error);
    }
})();
