import { Hono } from "hono";
const Main = new Hono();

import User from "./2-user";
import Blog from "./3-blog";

Main.route("/user",User)

Main.route('/blog',Blog)

export default Main;



