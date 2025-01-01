import { Hono } from "hono";
const Blog = new Hono();

Blog.post('/', (c) => {
    return c.text('Hello Hono!')
})

Blog.put('/', (c) => {
    return c.text('Hello Hono!')
})

Blog.get('/', (c) => {
    return c.text('Hello Hono!')
})

export default Blog;
