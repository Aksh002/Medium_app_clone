import { Hono } from 'hono'
//import { Main } from 
import { cors } from 'hono/cors'
const app = new Hono()
import Main from '../Routes/1-main';

app.use(cors());

app.route("/api/v1",Main)

app.get('/api/v1', (c) => {
  return c.text('Hello Hono!')
})
export default app
