import { VendorSchema, CarShopSchema } from "../db/schema.ts"
import { VendorCollection } from "../db/database.ts"

export const CarShopsVendors = (parent: CarShopSchema): Promise<VendorSchema | undefined>[] => {
    return parent.vendors.map(async (elem) => await VendorCollection.findOne({ _id: elem }));
}