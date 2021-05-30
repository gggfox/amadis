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
exports.Post = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Post_Category_1 = require("./Post_Category");
const Updoot_1 = require("./Updoot");
const User_1 = require("./User");
let Post = class Post extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "points", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Object)
], Post.prototype, "voteStatus", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], Post.prototype, "saved", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "int", default: 5 }),
    __metadata("design:type", Number)
], Post.prototype, "comision", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "int", default: 10 }),
    __metadata("design:type", Number)
], Post.prototype, "discount", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Post.prototype, "creatorId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.ManyToOne(() => User_1.User, user => user.posts),
    __metadata("design:type", User_1.User)
], Post.prototype, "creator", void 0);
__decorate([
    typeorm_1.OneToMany(() => Updoot_1.Updoot, (updoot) => updoot.post),
    __metadata("design:type", Array)
], Post.prototype, "updoots", void 0);
__decorate([
    type_graphql_1.Field(() => [Post_Category_1.Post_Category], { nullable: true }),
    typeorm_1.OneToMany(() => Post_Category_1.Post_Category, categories => categories.post),
    __metadata("design:type", Array)
], Post.prototype, "categories", void 0);
__decorate([
    type_graphql_1.Field(() => [User_1.User], { nullable: true }),
    typeorm_1.ManyToMany(() => User_1.User, user => user.promotes),
    __metadata("design:type", Array)
], Post.prototype, "promotors", void 0);
__decorate([
    type_graphql_1.Field(() => [User_1.User], { nullable: true }),
    typeorm_1.ManyToMany(() => User_1.User, user => user.savedProducts),
    __metadata("design:type", Array)
], Post.prototype, "interestedUsers", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
Post = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map