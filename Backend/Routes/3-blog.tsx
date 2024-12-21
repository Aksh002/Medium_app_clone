import { Hono } from "hono";
const Blog = new Hono();

Blog.post('/signup', (c) => {
    return c.text('Hello Hono!')
})


Blog.post('/signin', (c) => {
    return c.text('Hello Hono!')
})

export default Blog;
