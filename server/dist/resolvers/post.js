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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.PostResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const typeorm_1 = require("typeorm");
const Updoot_1 = require("../entities/Updoot");
const User_1 = require("../entities/User");
const Post_Category_1 = require("../entities/Post_Category");
const graphql_upload_1 = require("graphql-upload");
const fs_1 = require("fs");
let PostInput = class PostInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    __metadata("design:type", Object)
], PostInput.prototype, "categoryNames", void 0);
PostInput = __decorate([
    type_graphql_1.InputType()
], PostInput);
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    type_graphql_1.Field(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    type_graphql_1.ObjectType()
], PaginatedPosts);
let PostFieldError = class PostFieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostFieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostFieldError.prototype, "message", void 0);
PostFieldError = __decorate([
    type_graphql_1.ObjectType()
], PostFieldError);
let PostResponse = class PostResponse {
};
__decorate([
    type_graphql_1.Field(() => [PostFieldError], { nullable: true }),
    __metadata("design:type", Array)
], PostResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Post_1.Post, { nullable: true }),
    __metadata("design:type", Post_1.Post)
], PostResponse.prototype, "post", void 0);
PostResponse = __decorate([
    type_graphql_1.ObjectType()
], PostResponse);
let PostResolver = class PostResolver {
    textSnippet(root) {
        return root.text.slice(0, 50);
    }
    creator(post, { userLoader }) {
        return userLoader.load(post.creatorId);
    }
    addPicture({ createReadStream, filename }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("\n\n\nfilename" + filename + "\n\n\n");
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                createReadStream()
                    .pipe(fs_1.createWriteStream(__dirname + `/../../images/${filename}`))
                    .on("finish", () => resolve(true))
                    .on("error", () => reject(false));
            }));
        });
    }
    voteStatus(post, { updootLoader, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            const updoot = yield updootLoader.load({
                postId: post.id,
                userId: req.session.userId,
            });
            return updoot ? updoot.value : null;
        });
    }
    vote(postId, value, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdoot = (value !== -1);
            const { userId } = req.session;
            const realValue = isUpdoot ? 1 : -1;
            const updoot = yield Updoot_1.Updoot.findOne({ where: { postId, userId } });
            if (updoot && updoot.value !== realValue) {
                yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`
                    update updoot
                    set value = $1
                    where "postId" = $2 and "userId" = $3
                    `, [realValue, postId, userId]);
                    yield tm.query(`
                    update post
                    set points = points + $1
                    where id = $2
                    `, [2 * realValue, postId]);
                }));
            }
            else if (!updoot) {
                yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`
                    insert into updoot ("userId", "postId", value)
                    values ($1, $2, $3)
                    `, [userId, postId, realValue]);
                    yield tm.query(`
                    update post
                    set points = points + $1
                    where id = $2
                    `, [realValue, postId]);
                }));
            }
            Updoot_1.Updoot.insert({
                userId,
                postId,
                value: realValue,
            });
            return true;
        });
    }
    posts(limit, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const realLimit = Math.min(50, limit);
            const realLimitPlusOne = realLimit + 1;
            const replacements = [realLimitPlusOne];
            if (cursor) {
                replacements.push(new Date(parseInt(cursor)));
            }
            const posts = yield typeorm_1.getConnection().query(`
        SELECT p.*
        FROM post p
        ${cursor ? `WHERE p."createdAt" < $2` : ""}
        ORDER BY p."createdAt" DESC
        LIMIT $1
        `, replacements);
            return {
                posts: posts.slice(0, realLimit),
                hasMore: posts.length === realLimitPlusOne
            };
        });
    }
    post(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne({
                where: { id: id },
                relations: ["categories", "promotors"]
            });
            return post;
        });
    }
    postsByCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield typeorm_1.getConnection().query(`
        SELECT * FROM post p 
        LEFT JOIN post__category pc 
        ON p.id=pc."postId" 
        WHERE pc."categoryName"= $1
        `, [categoryName]);
            return posts;
        });
    }
    createPost(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let errors = [];
            if (input.title.trim() === "") {
                errors.push({
                    field: "title",
                    message: "se necesita un titulo para el producto",
                });
            }
            if (input.text.trim() === "") {
                errors.push({
                    field: "text",
                    message: "se necesita una descripcion para el producto",
                });
            }
            if (errors.length > 0) {
                return { errors, };
            }
            const post = yield Post_1.Post.create({
                title: input.title,
                text: input.text,
                creatorId: req.session.userId,
            }).save();
            const categories = input.categoryNames;
            if (categories && categories.length <= 5) {
                for (let i = 0; i < categories.length; i++) {
                    yield Post_Category_1.Post_Category.create({ postId: post.id, categoryName: categories[i] }).save();
                }
            }
            return { post, };
        });
    }
    updatePost(id, title, text, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(req.session.userId);
            let creatorId;
            if ((user === null || user === void 0 ? void 0 : user.userType) === "admin") {
                const post = yield Post_1.Post.findOne(id);
                creatorId = post === null || post === void 0 ? void 0 : post.creatorId;
            }
            else {
                creatorId = req.session.userId;
            }
            const results = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .update(Post_1.Post)
                .set({ title, text })
                .where('id = :id and "creatorId" = :creatorId', { id, creatorId: creatorId })
                .returning("*")
                .execute();
            return results.raw[0];
        });
    }
    deletePost(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(req.session.userId);
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return false;
            }
            if (post.creatorId !== req.session.userId && (user === null || user === void 0 ? void 0 : user.userType) !== "admin") {
                throw new Error('not authorized');
            }
            yield Updoot_1.Updoot.delete({ postId: id });
            yield Post_Category_1.Post_Category.delete({ postId: id });
            yield Post_1.Post.delete({ id, creatorId: post.creatorId });
            return true;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "creator", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("picture", () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "addPicture", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "voteStatus", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('postId', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('value', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    type_graphql_1.Query(() => PaginatedPosts),
    __param(0, type_graphql_1.Arg('limit', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('cursor', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.Post, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    type_graphql_1.Query(() => [Post_1.Post], { nullable: true }),
    __param(0, type_graphql_1.Arg('categoryName', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "postsByCategory", null);
__decorate([
    type_graphql_1.Mutation(() => PostResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('title')),
    __param(2, type_graphql_1.Arg('text')),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map