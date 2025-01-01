import { Hono } from 'hono'
import { cors } from 'hono/cors'
const app = new Hono<{ Bindings: { DATABASE_URL: string}}>()
import Main from '../Routes/1-main';


// Initializing the prisma client 
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'



app.use(cors());

app.route("/api/v1",Main)

app.post('/api/v1', (c) => {
  // IN express u can get env variable using :- 
  //                    const DATABASE_URL=process.env.DATABASE_URL

  // IN Hono:-
  // const DATABASE_URL=c.env.DATABASE_URL
  // THis stores the enviroment variable DATABASE_URL present in "/wrangler.toml"

  // Initializing the prisma client 
  const prisma = new PrismaClient({
    datasourceUrl: //c.env.DATABASE_URL,    // Here the error is " 'c.env' is of type 'unknown' if u declare "const app = new Hono()", " so the issue arrises, "How do u assign types to a enviroment variable(c.env) ", way to solve this is to add "<{Bindings: {     DATABASE_URL: string    }    }>" while instantiating HONO object
                  c.env.DATABASE_URL, 
  }).$extends(withAccelerate())

  return c.text('Hello Hono!')
})
export default app
