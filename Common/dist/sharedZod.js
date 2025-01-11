"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogUPDschema = exports.blogSchema = exports.loginSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    userName: zod_1.z.string(),
    firstName: zod_1.z.string().optional(),
    password: zod_1.z.string().min(8)
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.blogSchema = zod_1.z.object({
    title: zod_1.z.string().max(40).optional(),
    subTitle: zod_1.z.string().max(40).optional(),
    content: zod_1.z.string().optional()
});
exports.blogUPDschema = zod_1.z.object({
    title: zod_1.z.string().max(40).optional(),
    subTitle: zod_1.z.string().max(40).optional(),
    content: zod_1.z.string().optional()
});
