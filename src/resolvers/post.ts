import { RouterContext } from "oak";
import { TransactionCollection, UserCollection } from "../db/database.ts";
import { TransactionSchema, UserSchema } from "../db/schema.ts";
import { ObjectId } from "mongo"

type AddUserContext = RouterContext<"/addUser", Record<string | number, string | undefined>, Record<string, any>>
type AddTransactionContext = RouterContext<"/addTransaction", Record<string | number, string | undefined>, Record<string, any>>

export const addUser = async (context:AddUserContext) => {

    try {

        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!(value?.email && value?.name && value?.surname && value?.telephone && value?.DNI)) {
            context.response.status = 400;
            context.response.body = { message: "Bad Request" }
            return;
        }

        const isAllWellFormated = new RegExp("^[0-9]{8,8}[A-Za-z]$").test(value.DNI) && new RegExp("[0-9]{9}").test(value.telephone) 
        && new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(value.email)

        if (!isAllWellFormated) {
            context.response.status = 422;
            context.response.body = { message: "Bad format on DNI, telephone or email" }
            return;
        }

        if (await UserCollection.findOne({ $or:[{email: value.email}, {telephone: value.telephone}, {DNI: value.DNI} ]})) {
            context.response.status = 409;
            context.response.body = { message: "Already exists" };
            return
        }

        let iban = "ES"
        for(let i = 0; i < 20; i++){
            iban += Math.floor(Math.random() * (9 - 0 + 1) + 0);
        }
        while (await UserCollection.findOne({IBAN: iban})){
            iban = "ES"
            for (let i = 0; i < 20; i++) {
                iban += Math.floor(Math.random() * (9 - 0 + 1) + 0);
            }
        }

        const id = await UserCollection.insertOne({...value,IBAN:iban} as UserSchema);
        context.response.body = { ...value, IBAN: iban, _id: id }
        
    } catch (error) {
        console.error(error)
    }
    
};

export const addTransaction = async (context: AddTransactionContext) => {
    try {

        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!(value?.ID_Sender && value?.ID_Receiver && value?.amount)) {
            context.response.status = 400;
            context.response.body = { message: "Bad Request" }
            return;
        }

        if (!(await UserCollection.findOne({ _id: new ObjectId(value.ID_Sender) }) && await UserCollection.findOne({ _id: new ObjectId(value.ID_Sender) }))) {
            context.response.status = 404;
            context.response.body = { message: "One or more users does not exist" };
            return
        }

        await TransactionCollection.insertOne(value as TransactionSchema);
        context.response.body = value
        
    } catch (error) {
        console.error(error)
    }
    
};