import { VendorSchema, CarSchema, CarShopSchema } from "../db/schema.ts"
import { CarShopCollection, VendorCollection, CarCollection } from "../db/database.ts"
import { ObjectId } from "mongo"

export const createCarShop = async (_: unknown, args: { name: string, city: string }): Promise<CarShopSchema | undefined> => {
    
    try {
	    const carshop = args as CarShopSchema
	    carshop.vendors = []
	    const id = await CarShopCollection.insertOne(carshop)
	    return await CarShopCollection.findOne({_id: id})
    } catch (error) {
        console.error(error)
    }
}

export const createVendor = async (_: unknown, args: { name: string }): Promise<VendorSchema | undefined> => {

    try {
	    const vendor = args as VendorSchema
	    vendor.cars = []
	    const id = await VendorCollection.insertOne(vendor)
	    return await VendorCollection.findOne({ _id: id })
    } catch (error) {
        console.error(error)
    }
}

export const createCar = async (_: unknown, args: { plate: string, color: string, seats: number, model: string, price: number }): Promise<CarSchema | undefined> => {

    try {
        console.log(args.plate)
	    if (!new RegExp("^[0-9]{1,4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}").test(args.plate)){
	        throw new Error("Incorrect plate format");
	    }
	
	    const car = await CarCollection.findOne({plate: args.plate})
	
	    if(!car){
	        const id = await CarCollection.insertOne(args as CarSchema)
	        return await CarCollection.findOne({ _id: id })
	    }
	
	    return car
    } catch (error) {
        console.error(error)
    }
}

export const addCarToVendor = async (_: unknown, args: { vendor: string, car: string }): Promise<VendorSchema | undefined> => {

    try {
	    if (!(await VendorCollection.findOne({ _id: new ObjectId(args.vendor) }) && await CarCollection.findOne({ _id: new ObjectId(args.car) }))){
	        throw new Error("Vendor or Car does not exist");   
	    }
	
	    await VendorCollection.updateOne({ _id: new ObjectId(args.vendor) }, {
	        $push: {
	            cars: new ObjectId(args.car)
	        },
	    })
	    return await VendorCollection.findOne({ _id: new ObjectId(args.vendor) })
    } catch (error) {
        console.error(error)
    }
}

export const addVendorToCarShop = async (_: unknown, args: { carshop: string, vendor: string }): Promise<CarShopSchema | undefined> => {

    try {
	    if (!(await VendorCollection.findOne({ _id: new ObjectId(args.vendor) }) && await CarShopCollection.findOne({ _id: new ObjectId(args.carshop) }))) {
	        throw new Error("Vendor or Car does not exist");
	    }
	
	    await CarShopCollection.updateOne({ _id: new ObjectId(args.carshop) }, {
	        $push: {
	            vendors: new ObjectId(args.vendor)
	        },
	    })
	    return await CarShopCollection.findOne({ _id: new ObjectId(args.carshop) })
    } catch (error) {
        console.error(error)
    }
}