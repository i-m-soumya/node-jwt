import mongoose from "mongoose"

let MONGO_URI :string = process.env.MONGO_URI || ''
exports.connect = () => {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error: any) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};