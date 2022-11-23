"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var app_1 = __importDefault(require("./app"));
var server = http_1.default.createServer(app_1.default);
var API_PORT = process.env.API_PORT;
var port = process.env.PORT || API_PORT;
// server listening 
server.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
