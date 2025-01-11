import { z } from "zod";

export const userSchema=z.object({
    email: z.string().email(),
    userName: z.string(),
    firstName: z.string().optional(),
    password: z.string().min(8)
  })

export const loginSchema=z.object({
    email: z.string().email(),
    password: z.string()
  })
  
export const blogSchema=z.object({
    title: z.string().max(40).optional(),
    subTitle: z.string().max(40).optional(),
    content: z.string().optional()
})

export const blogUPDschema=z.object({
    title: z.string().max(40).optional(),
    subTitle: z.string().max(40).optional(),
    content: z.string().optional()
})

//                                                              Type inference in ZOD 

// We infer the type of the input data to the Frontend so that the type-check for input that FE asks from user and what BE accepts as input gets streamLined
// FrontENd need this 
// Since FrontEnd folder will be different, we cannot export type inference from THe Backend folder, we need a COMMON Folder to export the schema variables to BE and types to FE
// Although you dont need to do this if we are using monoRepos, but for now , it is used

export type userSchema= z.infer<typeof userSchema>

export type loginSchema= z.infer<typeof loginSchema>

export type blogSchema= z.infer<typeof blogSchema>

export type blogUPDschema= z.infer<typeof blogUPDschema>