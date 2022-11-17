import { RouterContext } from "oak";
import { BookCollection, UserCollection } from "../db/database.ts";
import { ObjectId } from "mongo"
import { getQuery } from "oak/helpers.ts";

type GetUserContext = RouterContext<"/getBooks", Record<string | number, string | undefined>, Record<string, any>>

export const getBooks = async (context: GetUserContext) => {
    try {

        const params = getQuery(context, { mergeParams: true });

        if (!params?.page){
            context.response.status = 400
            context.response.body = {message: "Bad Request"}
            return
        }

        let query = {}

        if(params?.title){
            query = { title: params.title }
        }

        const books = await BookCollection.find(query).skip(Number(params.page)*10).limit(10).toArray()

        context.response.body = books
        
        
    } catch (error) {
        console.error(error)
    }

}