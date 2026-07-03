import { Hono } from "hono";
const Main = new Hono();

import User from "./2-user";
import Blog from "./3-blog";
import Posts from "./4-posts";
import UsersRoute from "./5-users";
import SeriesRoute from "./6-series";
import Platform from "./7-platform";

Main.route("/user",User)

Main.route('/blog',Blog)

Main.route("/posts", Posts)
Main.route("/users", UsersRoute)
Main.route("/series", SeriesRoute)
Main.route("/", Platform)

export default Main;



