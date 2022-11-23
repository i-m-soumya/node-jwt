"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var MONGO_URI = process.env.MONGO_URI || '';
exports.connect = function () {
    mongoose_1.default
        .connect(MONGO_URI)
        .then(function () {
        console.log("Successfully connected to database");
    })
        .catch(function (error) {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
};
