"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const User_1 = require("../entities/User");
const isAdmin = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("not authenticated");
    }
    const isAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.User.findOne(context.req.session.userId);
        console.log(user);
        if ((user === null || user === void 0 ? void 0 : user.userType) === "admin") {
            return true;
        }
        return false;
    });
    if (!isAdmin) {
        throw new Error("user is not admin");
    }
    else {
        return next();
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map