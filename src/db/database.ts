import { MongoClient } from "mongo";
import { config } from "dotenv"
import { UserSchema, TransactionSchema } from "./schema.ts"

const env = config();

if (!(env.MONGO_USER && env.MONGO_PWD)){
    console.error("No enviroment variables: MONGO_USER or MONGO_PWD")
    throw Error("No enviroment variables: MONGO_USER or MONGO_PWD")
}

const client = new MongoClient();
await client.connect(`mongodb+srv://${env.MONGO_USER}:${env.MONGO_PWD}@cluster0.xrahcje.mongodb.net/banco?authMechanism=SCRAM-SHA-1`)
const db = client.database("banco")
console.info("MongoDB connected!")

export const UserCollection = db.collection<UserSchema>("Users")
export const TransactionCollection = db.collection<TransactionSchema>("Transactions")