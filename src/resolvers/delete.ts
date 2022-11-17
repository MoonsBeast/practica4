import { RouterContext } from "oak";
import { UserCollection } from "../db/database.ts";
import { ObjectId } from "mongo"

type DeleteUserContext = RouterContext<"/deleteUser/:_id", { _id: string; } & Record<string | number, string | undefined>, Record<string, any>>

export const deleteUser = async (context: DeleteUserContext) => {

    try {

        if (!(context.params?._id)) {
            context.response.status = 400
            context.response.body = { message: "Bad Request" }
            return
        }

        const resp = await UserCollection.deleteOne({ _id: new ObjectId(context.params._id) })

        if (resp < 1) {
            context.response.status = 404
            context.response.body = { message: "User not found" }
            return
        }

        context.response.body = { message: "Deleted" }
        
    } catch (error) {
        console.error(error)
    }
    
}