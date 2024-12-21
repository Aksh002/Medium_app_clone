import { Hono } from "hono";
const User = new Hono();

User.get('/', (c) => {
    return c.text('Hello Hono!')
  })

export default User