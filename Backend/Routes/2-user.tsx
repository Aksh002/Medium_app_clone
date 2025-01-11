import { Hono } from "hono";
//  const User = new Hono();
// const User = new Hono().basePath('/user')                                      // Another way routing, when app.route('/', user), only with provided base are handled by it

const User = new Hono<{ Bindings: { DATABASE_URL: string , JWT_SECRET: string}    // 
                    //  Variables: { prisma : PrismaClient }                      // Used for Prisma middleware         
}>()

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify,decode } from "hono/jwt";
import { z } from "zod";
import { generateSalt, hashPswd, verifyPswd } from "../hashPswdLogic";
import { userSchema } from "@akshit_gangwar/medium-common-v2/dist/sharedZod";
import { loginSchema } from "@akshit_gangwar/medium-common-v2/dist/sharedZod";

//                                        Prisma MIDDLEWARE
// User.use('*',async (c,next) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,          
//   }).$extends(withAccelerate())
  
//   c.set("prisma",prisma as unknown as PrismaClient)
//   next();
// })
// To access this use "const user = c.var.prisma.users.create()"


User.post('/signup',async (c) => {
  const body= await c.req.json();

  // Input validation
  const { success }=userSchema.safeParse(body);
  if (!success){
    c.status(401)
    return c.json({
      msg:"Invalid Entries,PLease try again"
    })
  }

  // Initializing the prisma client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,          
  }).$extends(withAccelerate())

  // Finding if user existing
  const find=await prisma.users.findFirst({
    where:{
      email: body.email
    },
    select:{
      userName:true,
      email:true
    }
  })
  if (find!=null){
    c.status(411);
    return c.json({
      msg:`User Already exists with id :- ${find.email}`
    })
  }

  // Hashing password
  const hashPass :string=await hashPswd(body.password,generateSalt())

  // Creating User
  const user=await prisma.users.create({
    data:{
      email: body.email,
      userName: body.userName,
      firstName: body.firstName?body.firstName:body.userName,
      hashPass: hashPass,
    }
  })

  // Creating a token
  const paylod={
    email: user.email,
    id: user.id
  }
  
  const token=await sign(paylod,c.env.JWT_SECRET)                   // YOU FORGOT "await" HERE IDIOT
  console.log(token); 

  return c.json({
    "token":token
  })
})



User.get('/signin',async (c) => {
  const body= await c.req.json();

  const { success }=loginSchema.safeParse(body)

  if (!success){
    c.status(403)
    return c.json({
      error:"Invalid input"
    })
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,          
  }).$extends(withAccelerate())

  const user= await prisma.users.findFirst({
    where:{
      email: body.email
    }
  })
  if (!user){
    c.status(404)
    return c.json({
      msg:"No user found with the given Email"
    })
  }
  const check=await verifyPswd(user.hashPass,body.password)
  if (!check){
    c.status(403)
    return c.json({
      msg:"Incorrect Password"
    })
  }
  
  const payload={
    email: user.email,
    id: user.id
  }
  const token=await sign(payload,c.env.JWT_SECRET)
  
    return c.json({
      token: token
    })
  })

User.get('/me', (c) => {
    return c.text('Hello Hono!')
  })

export default User