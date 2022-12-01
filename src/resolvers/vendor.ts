import { VendorSchema, CarSchema } from "../db/schema.ts"
import { CarCollection } from "../db/database.ts"

export const VendorsCars = (parent: VendorSchema): Promise<CarSchema | undefined>[] => {
    return parent.cars.map(async (elem) => await CarCollection.findOne({ _id: elem }));
}