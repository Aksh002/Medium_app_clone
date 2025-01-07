import { Hono } from "hono";
import { verify } from "hono/jwt";
import { number } from "zod";
const Blog = new Hono<{ 
                        Bindings: { DATABASE_URL: string , JWT_SECRET: string}, 
                        Variables: { userId : string }
                    }>()

//                                        Auth  MIDDLEWARE
Blog.use('/*',async (c,next)=>{
    const token=c.req.header("Authorization")
    if (!token){
        c.status(411)
        return c.json("Unothorized")
    }

    const tokenPart=token.split(" ")[1]
    const payload=await verify(tokenPart,c.env.JWT_SECRET)
    if (!payload){
        c.status(411)
        return c.json("Session Logged out, Log in again")
    }

    if (typeof payload.id !== 'string') {
        c.status(400);
        return c.json("Invalid token payload");
    }
    // To pass the extracted id frm the jwt into the main route, In Hono, we use            "SET/GET"
    
    c.set('userId',payload.id)
    next();
})

Blog.post('/', (c) => {
    const id=c.get('userId')
    return c.text('Hello Hono!')
})

Blog.put('/', (c) => {
    return c.text('Hello Hono!')
})

Blog.get('/', (c) => {
    return c.text('Hello Hono!')
})

export default Blog;
