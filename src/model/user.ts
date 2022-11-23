import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, default: null },
    password: { type: String, default: null },
    token: { type: String },
});

export default mongoose.model("user", userSchema);