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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromotorUpdootLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const PromotorUpdoot_1 = require("../entities/PromotorUpdoot");
const createPromotorUpdootLoader = () => new dataloader_1.default((keys) => __awaiter(void 0, void 0, void 0, function* () {
    const updoots = yield PromotorUpdoot_1.PromotorUpdoot.findByIds(keys);
    const updootIdToUpdoot = {};
    updoots.forEach((up) => {
        updootIdToUpdoot[`${up.userId}|${up.promotorId}`] = up;
    });
    return keys.map((key) => updootIdToUpdoot[`${key.userId}|${key.promotorId}`]);
}));
exports.createPromotorUpdootLoader = createPromotorUpdootLoader;
//# sourceMappingURL=createPromotorUpdootLoader.js.map