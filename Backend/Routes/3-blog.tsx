import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { blogSchema } from "@akshit_gangwar/medium-common-v2/dist/sharedZod";
import { blogUPDschema } from "@akshit_gangwar/medium-common-v2/dist/sharedZod"
//import { blogUPDschema } from "@akshit_gangwar/medium-common/dist/sharedZod"

const Blog = new Hono<{ 
                        Bindings: { DATABASE_URL: string , JWT_SECRET: string}, 
                        Variables: { userId : string , prisma : PrismaClient }
                    }>()

//                                        Auth  MIDDLEWARE
Blog.use('/*', async (c, next) => {
    try {
      // Extract the Authorization header
      const token = c.req.header("Authorization");
      if (!token) {
        c.status(401); // 401 Unauthorized
        return c.json({ error: "Unauthorized: Token missing" });
      }
  
      // Extract the JWT part
      const tokenPart = token.split(" ")[1];
      if (!tokenPart) {
        c.status(401); // 401 Unauthorized
        return c.json({ error: "Unauthorized: Malformed token" });
      }
  
      // Verify the JWT and handle potential errors
      let payload;
      try {
        payload = await verify(tokenPart, c.env.JWT_SECRET);
      } catch (err) {
        // Handle verification errors gracefully
        c.status(403); // 403 Forbidden
        return c.json({ error: "Invalid or expired token, please log in again" });
      }
  
      // Validate the payload structure
      if (!payload || typeof payload.id !== 'string') {
        c.status(400); // 400 Bad Request
        return c.json({ error: "Invalid token payload" });
      }
  
      // Set the userId in the context for the next middleware/route
      c.set('userId', payload.id);
      await next();
    } catch (err) {
      // Catch any unexpected errors and provide a user-friendly response
      console.error("Unexpected error in middleware:", err);
      c.status(500); // 500 Internal Server Error
      return c.json({ error: "An unexpected error occurred, please try again later" });
    }
  });
  

//                                    Prisma MIDDLEWARE
// Here we push the prisma client variable in context c, and acess through c.var.prisma
Blog.use('/*',async (c,next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,          
  }).$extends(withAccelerate())
  
  c.set("prisma",prisma as unknown as PrismaClient)
  await next();
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
            title: body.title?body.title:"....Empty....",
            subTitle: body.subTitle?body.subTitle:"....Empty....",
            content: body.content?body.content:"....Empty....",
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
    const userId= c.get('userId')
    const post= await c.var.prisma.posts.update({
        where:{
            id:id,
            authorId:userId
        },
        data:{
            published:true
        }
    })
    if (!post){
        c.status(404)
        return c.json({
            msg:"OOPs!!! You didnt saved any post here"
        })
    }
    return c.json({
        msg:"Published"
    })
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


    if (old.published){
        c.status(413)
        return c.json({
            msg:" You can not edit this Blog, It is Already Public"
        })
    }

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
Blog.get('/',async (c) => {
    const id= c.req.query('id')

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
Blog.get('/bulk',async (c) => {
    const allPost= await c.var.prisma.posts.findMany({
        where:{
            published:true
        }
    })
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

Blog.delete('/:id',async (c) => {
    const id=c.req.param('id')
    const userId=c.get('userId')
    const post=await c.var.prisma.posts.delete({
        where:{
            id:id,
            authorId:userId
        }
    })
    if (!post){
        c.status(400)
        return c.json({
            msg:"Post Couldnt be deleted"
        })
    }
    return c.json({
        msg:"Post Deleted Successfully"
    })
})

Blog.get('/myPosts',async (c) => {
    const  userId=c.get('userId')
    const myPost= await c.var.prisma.posts.findMany({
        where:{
            published:true,
            authorId:userId
        }
    })
    if (!myPost){
        return c.json({
            msg:"Nothing to see here"
        })
    }
    return c.json({
        allPost:myPost
    })
})

Blog.get('/drafts',async (c) => {
    const  userId=c.get('userId')
    const myPost= await c.var.prisma.posts.findMany({
        where:{
            published:false,
            authorId:userId
        }
    })
    if (!myPost){
        return c.json({
            msg:"Nothing to see here"
        })
    }
    return c.json({
        allPost:myPost
    })
})


export default Blog;
