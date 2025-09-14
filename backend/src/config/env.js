"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, value) {
    if (!value)
        throw new Error(`Missing required env var: ${name}`);
    return value;
}
exports.config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT || 4000),
    MONGO_URI: required('MONGO_URI', process.env.MONGO_URI),
    JWT_SECRET: required('JWT_SECRET', process.env.JWT_SECRET),
};
exports.default = exports.config;
