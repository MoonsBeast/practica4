import { RouterContext } from "oak";
import { BookCollection, UserCollection } from "../db/database.ts";
import { ObjectId } from "mongo"


type UpdateCartContext = RouterContext<"/updateCart", Record<string | number, string | undefined>, Record<string, any>>

export const updateCart = async (context: UpdateCartContext) => {

    try {

        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!(value?.book && value?.user)) {
            context.response.status = 400;
            context.response.body = { message: "Bad Request" }
            return;
        }

        const user = await UserCollection.findOne({ _id: new ObjectId(value.user) })

        if (!( user && (await BookCollection.findOne({ _id: new ObjectId(value.book) })))) {
            context.response.status = 404;
            context.response.body = { message: "User or book not found" };
            return
        }

        const ans = await UserCollection.updateOne({ _id: user._id }, {
            $set: {
                cart: user.cart.concat(new ObjectId(value.book)) 
            }
        })
        context.response.body = {message: "Updated correctly"}

    } catch (error) {
        console.error(error)
    }

};