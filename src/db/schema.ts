import { Car, CarShop, Vendor } from "../types.ts"
import { ObjectId } from "mongo"

export type CarShopSchema = Omit<CarShop, "id" | "vendors"> & { _id: ObjectId, vendors: ObjectId[] }
export type VendorSchema = Omit<Vendor, "id" | "cars"> & { _id: ObjectId, cars: ObjectId[] }
export type CarSchema = Omit<Car, "id"> & { _id: ObjectId }