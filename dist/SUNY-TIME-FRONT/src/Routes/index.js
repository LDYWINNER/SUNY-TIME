"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.ProtectedRoute = exports.LoginEmail = exports.VerifyEmail = exports.CRBeforeRegister = exports.Register = exports.SchoolInfoHome = exports.SinglePost = exports.Bulletin = exports.ScheduleManager = exports.Home = void 0;
const Home_1 = __importDefault(require("./Home"));
exports.Home = Home_1.default;
const ScheduleManager_1 = __importDefault(require("./ScheduleManager"));
exports.ScheduleManager = ScheduleManager_1.default;
const Bulletin_1 = __importDefault(require("./Bulletin"));
exports.Bulletin = Bulletin_1.default;
const SinglePost_1 = __importDefault(require("./SinglePost"));
exports.SinglePost = SinglePost_1.default;
const SchoolInfoHome_1 = __importDefault(require("./SchoolInfoHome"));
exports.SchoolInfoHome = SchoolInfoHome_1.default;
const Register_1 = __importDefault(require("./Register"));
exports.Register = Register_1.default;
const CRBeforeRegister_1 = __importDefault(require("./CRBeforeRegister"));
exports.CRBeforeRegister = CRBeforeRegister_1.default;
const VerifyEmail_1 = __importDefault(require("./VerifyEmail"));
exports.VerifyEmail = VerifyEmail_1.default;
const LoginEmail_1 = __importDefault(require("./LoginEmail"));
exports.LoginEmail = LoginEmail_1.default;
const ProtectedRoute_1 = __importDefault(require("./ProtectedRoute"));
exports.ProtectedRoute = ProtectedRoute_1.default;
const Error_1 = __importDefault(require("./Error"));
exports.Error = Error_1.default;
