import { MongoClient } from "mongo";
import { config } from "dotenv"
import { UserSchema, BookSchema, AuthorSchema } from "./schema.ts"

const env = config();

if (!env.URL_MONGO){
    console.error("No enviroment variable: URL_MONGO")
    throw Error("No enviroment variable: URL_MONGO")
}

const client = new MongoClient();
await client.connect(env.URL_MONGO)
const db = client.database("library")
console.info("MongoDB connected!")

export const UserCollection = db.collection<UserSchema>("Users")
export const BookCollection = db.collection<BookSchema>("Books")
export const AuthorCollection = db.collection<AuthorSchema>("Authors")