import { Application, Router } from "oak";
import { config } from "dotenv"
import { addUser,addAuthor,addBook } from "./resolvers/post.ts"
import { getBooks } from "./resolvers/get.ts"
import { deleteUser } from "./resolvers/delete.ts"
import { updateCart } from "./resolvers/put.ts"

const router = new Router();
const env = config()

if(!env.PORT){
    console.error("No enviroment variable: PORT")
    throw Error("No enviroment variable: PORT")
}

router.get("/test",(context) => {

    context.response.body = "Up and Running"

}).post("/addUser",addUser)
    .post("/addBook", addBook)
    .post("/addAuthor", addAuthor)
    .get("/getBooks",getBooks)
    .delete("/deleteUser/:_id", deleteUser)
    .put("/updateCart",updateCart)

const app = new Application();
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({port: Number(env.PORT)})