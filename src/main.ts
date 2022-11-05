import { Application, Router } from "oak";
import { addUser,addTransaction } from "./resolvers/post.ts"
import { getUser } from "./resolvers/get.ts"
import { deleteUser } from "./resolvers/delete.ts"

const router = new Router();

router.get("/test",(context) => {

    context.response.body = "Up and Running"

}).get("/getUser/:param",getUser)
.post("/addUser", addUser)
.delete("/deleteUser/:email", deleteUser)
.post("/addTransaction",addTransaction)

const app = new Application();
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({port:7777})