import { RouterContext } from "oak";
import { UserCollection } from "../db/database.ts";
import { ObjectId } from "mongo"

type GetUserContext = RouterContext<"/getUser/:param", {
    param: string;
} & Record<string | number, string | undefined>, Record<string, any>>

export const getUser = async (context: GetUserContext) => {
    try {

        if (!(context.params?.param)){
            context.response.status = 400
            context.response.body = {message: "Bad Request"}
            return
        }

        let arg = {}
        if (new RegExp("^[0-9]{8,8}[A-Za-z]$").test(context.params?.param)){
            arg = { DNI: context.params?.param }
        } else if (new RegExp("[0-9]{9}").test(context.params?.param)) {
            arg = { telephone: context.params?.param }
        } else if (new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(context.params?.param)) {
            arg = { email: context.params?.param }
        } else if (new RegExp("([a-zA-Z]{2})\s*\t*(\d{2})\s*\t*(\d{4})\s*\t*(\d{4})\s*\t*(\d{2})\s*\t*(\d{10})").test(context.params?.param)) {
            arg = { IBAN: context.params?.param }
        } else {
            arg = { _id: new ObjectId(context.params?.param)}
        }

        const user = await UserCollection.findOne(arg)
        if (user) {
            context.response.body = user;
        }else{
            context.response.status = 404
            context.response.body = {
                message: "User not found"
            }
        }
        
    } catch (error) {
        console.error(error)
    }

}