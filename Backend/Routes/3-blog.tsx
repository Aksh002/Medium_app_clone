import { Hono } from "hono";
import { verify } from "hono/jwt";
import { z } from "zod";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const Blog = new Hono<{ 
                        Bindings: { DATABASE_URL: string , JWT_SECRET: string}, 
                        Variables: { userId : string , prisma : PrismaClient }
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
    await next();
})

//                                    Prisma MIDDLEWARE
// Here we push the prisma client variable in context c, and acess through c.var.prisma
Blog.use('/*',async (c,next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,          
  }).$extends(withAccelerate())
  
  c.set("prisma",prisma as unknown as PrismaClient)
  await next();
})


const blogSchema=z.object({
    title: z.string().max(40),
    subTitle: z.string().max(40).optional(),
    content: z.string()
})

 // Create the route to initialize a blog/post Solution
Blog.post('/',async  (c) => {                    
    const id=c.get('userId')
    const body= await c.req.json()

    // Input validation
    const { success }=blogSchema.safeParse(body);
    if (!success){
        c.status(403)
        return c.json({
            msg:'Incorrect Inputs, please Enter valid Charachters'
        })
    }
    const post =await c.var.prisma.posts.create({
        data:{
            title: body.title,
            subTitle: body.subTitle?body.subTitle:"",
            content: body.content,
            authorId: id
        }
    })
    if (!post){
        return c.json({
            msg:'Blog not saved'
        })
    }
    
    return c.json({
        msg:'Blog Saved Successifully',
        blogId: post.id
    })
})

Blog.post('/:id',async (c) => {
    const id=c.req.param('id')
    const post= await c.var.prisma.posts.findFirst({
        where:{
            id:id
        }
    })
    if (!post){
        c.status(404)
        return c.json({
            msg:"OOPs!!! You didnt saved any post here"
        })
    }
    post.published=true;
    return c.json({
        msg:"Published"
    })
})


const blogUPDschema=z.object({
    title: z.string().max(40).optional(),
    subTitle: z.string().max(40).optional(),
    content: z.string().optional()
})

// Updating all the posts
Blog.put('/:id',async (c) => {
    const id=c.req.param('id')
    const userId=c.get('userId')
    const body= await c.req.json()

    const old= await c.var.prisma.posts.findFirst({
        where:{
            id:id,
            authorId:userId
        }
    })

    if (!old){
        c.status(404)
        return c.json({
            msg:"Post Not Found"
        })
    }


    // if (old.published){
    //     c.status(413)
    //     return c.json({
    //         msg:" You can not edit this Blog, It is Already Public"
    //     })
    // }

    const { success }= blogUPDschema.safeParse(body)
    if (!success){
        c.status(411)
        return c.json({
            msg:"Invalid Inputs"
        })
    }
    
    const post= await c.var.prisma.posts.update({
        where:{
            id:id,
            authorId:userId
        },
        data:{
            title:body.title?body.title:old.title,
            subTitle: body.subTitle?body.subTitle:old.subTitle,
            content: body.content?body.content:old.content
        }
    })

    return c.json({
        msg:" Changes Saved "
    })

})

// Getting a post
Blog.get('/:id',async (c) => {
    const id= c.req.param('id')

    const post= await c.var.prisma.posts.findUnique({
        where:{
            id: id
        },
        select:{
            title:true,
            subTitle:true,
            content:true,
            published:true,
            id:false,
            authorId:false
        }
    })
    if (!post){
        c.status(404)
        return c.json({
            msg:" This post no longer exist"
        })
    }
    return c.json({
        post: post
    })
})

// Getting all posts
Blog.get('/',async (c) => {
    const allPost= await c.var.prisma.posts.findMany({})
    if (!allPost){
        return c.json({
            msg:"Nothing to see here"
        })
    }
    return c.json({
        allPost:allPost
    })
})


// Planned routes

Blog.get('/myPosts',async (c) => {
    
})

Blog.get('/savedPosts',async (c) => {
    
})
export default Blog;
