import { z } from "zod";
export declare const userSchema: z.ZodObject<{
    email: z.ZodString;
    userName: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    userName: string;
    password: string;
    firstName?: string | undefined;
}, {
    email: string;
    userName: string;
    password: string;
    firstName?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const blogSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    subTitle: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    subTitle?: string | undefined;
    content?: string | undefined;
}, {
    title?: string | undefined;
    subTitle?: string | undefined;
    content?: string | undefined;
}>;
export declare const blogUPDschema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    subTitle: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    subTitle?: string | undefined;
    content?: string | undefined;
}, {
    title?: string | undefined;
    subTitle?: string | undefined;
    content?: string | undefined;
}>;
export type userSchema = z.infer<typeof userSchema>;
export type loginSchema = z.infer<typeof loginSchema>;
export type blogSchema = z.infer<typeof blogSchema>;
export type blogUPDschema = z.infer<typeof blogUPDschema>;
