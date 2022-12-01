import { VendorSchema, CarSchema, CarShopSchema } from "../db/schema.ts"
import { CarShopCollection, VendorCollection, CarCollection } from "../db/database.ts"
import { ObjectId } from "mongo"

export const getCarById = async (_: unknown, args: { id: string }): Promise<CarSchema|undefined> => {
    return await CarCollection.findOne({ _id: new ObjectId(args.id) });
}

export const getCarInPriceRange = async (_: unknown, args: { min: number, max: number }): Promise<(CarSchema|undefined)[]> => {
    return await CarCollection.find({ price: {$gte: args.min, $lte: args.max} }).toArray();
}

export const getVendorById = async (_: unknown, args: { id: string }): Promise<VendorSchema | undefined> => {
    return await VendorCollection.findOne({ _id: new ObjectId(args.id) });
}

export const getVendorByName = async (_: unknown, args: { name: string}): Promise<(VendorSchema | undefined)[]> => {
    return await VendorCollection.find({ name: args.name }).toArray();
}

export const getCarShopById = async (_: unknown, args: { id: string }): Promise<CarShopSchema | undefined> => {
    return await CarShopCollection.findOne({ _id: new ObjectId(args.id) });
}

export const getCarShopsByCity = async (_: unknown, args: { city: string, page: number }): Promise<(CarShopSchema | undefined)[]> => {
    return await CarShopCollection.find({ city: args.city }).skip(args.page * 10).limit(10).toArray();
}