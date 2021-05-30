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
exports.Post_Category = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Category_1 = require("./Category");
const Post_1 = require("./Post");
let Post_Category = class Post_Category extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryColumn({ type: "int" }),
    __metadata("design:type", Number)
], Post_Category.prototype, "postId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Post_Category.prototype, "categoryName", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Post_1.Post, (post) => post.categories, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Post_1.Post)
], Post_Category.prototype, "post", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Category_1.Category, (category) => category.post_category, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Category_1.Category)
], Post_Category.prototype, "category", void 0);
Post_Category = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Post_Category);
exports.Post_Category = Post_Category;
;
//# sourceMappingURL=Post_Category.js.map