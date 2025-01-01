import { Hono } from "hono";
const User = new Hono();

User.get('/signup', (c) => {
    return c.text('Hello Hono!')
  })

User.get('/signup', (c) => {
    return c.text('Hello Hono!')
  })

User.get('/me', (c) => {
    return c.text('Hello Hono!')
  })

export default User