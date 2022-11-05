import { RouterContext } from "oak";
import { UserCollection } from "../db/database.ts";

type DeleteUserContext = RouterContext<"/deleteUser/:email", { email: string; } & Record<string | number, string | undefined>, Record<string, any>>

export const deleteUser = async (context: DeleteUserContext) => {

    try {

        if (!(context.params?.email)) {
            context.response.status = 400
            context.response.body = { message: "Bad Request" }
            return
        }

        const resp = await UserCollection.deleteOne({ email: context.params.email })

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