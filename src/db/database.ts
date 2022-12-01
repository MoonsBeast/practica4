import { MongoClient } from "mongo";
import { config } from "dotenv"
import { CarSchema,CarShopSchema,VendorSchema } from "./schema.ts"

const env = config();

if (!env.URL_MONGO) {
    console.error("No enviroment variable: URL_MONGO")
    throw Error("No enviroment variable: URL_MONGO")
}

const client = new MongoClient();
await client.connect(env.URL_MONGO)
const db = client.database("carshop")
console.info("MongoDB connected!")

export const CarShopCollection = db.collection<CarShopSchema>("CarShops")
export const VendorCollection = db.collection<VendorSchema>("Vendors")
export const CarCollection = db.collection<CarSchema>("Cars")