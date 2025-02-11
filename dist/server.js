"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const path_1 = __importDefault(require("path"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const auth_1 = __importDefault(require("./middleware/auth"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const bulletinPostRouter_1 = __importDefault(require("./routers/bulletinPostRouter"));
const courseRouter_1 = __importDefault(require("./routers/courseRouter"));
const app = (0, express_1.default)();
const logger = (0, morgan_1.default)("dev");
//middlewares
if (process.env.NODE_ENV !== "production") {
    app.use(logger);
}
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../SUNY-TIME-FRONT/build")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
//routers
app.use("/api/v1/auth", authRouter_1.default);
app.use("/api/v1/bulletin", auth_1.default, bulletinPostRouter_1.default);
app.use("/api/v1/course", auth_1.default, courseRouter_1.default);
//using frontend routes from build folder
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../SUNY-TIME-FRONT/build", "index.html"));
});
app.use(not_found_1.default);
app.use(error_handler_1.default);
exports.default = app;
