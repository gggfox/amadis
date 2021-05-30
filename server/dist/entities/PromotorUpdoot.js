"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotorUpdoot = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let PromotorUpdoot = class PromotorUpdoot extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], PromotorUpdoot.prototype, "value", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], PromotorUpdoot.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.updoots),
    __metadata("design:type", User_1.User)
], PromotorUpdoot.prototype, "user", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], PromotorUpdoot.prototype, "promotorId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (promotor) => promotor.updoots, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", User_1.User)
], PromotorUpdoot.prototype, "promotor", void 0);
PromotorUpdoot = __decorate([
    typeorm_1.Entity()
], PromotorUpdoot);
exports.PromotorUpdoot = PromotorUpdoot;
//# sourceMappingURL=PromotorUpdoot.js.map