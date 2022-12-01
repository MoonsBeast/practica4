import { ApolloServer } from "apolloserver"
import { startStandaloneServer } from "apolloserver/standalone"
import { config } from "dotenv"

import { typeDefs } from "./gqlschema.ts"
import { CarSchema, VendorSchema, CarShopSchema } from "./db/schema.ts"
import { CarShopsVendors } from "./resolvers/carshop.ts"
import { VendorsCars } from "./resolvers/vendor.ts"
import { 
    getCarById,
    getCarInPriceRange,
    getVendorById,
    getVendorByName,
    getCarShopById,
    getCarShopsByCity } from "./resolvers/query.ts"
import { 
    createCar,
    createCarShop,
    createVendor,
    addCarToVendor,
    addVendorToCarShop } from "./resolvers/mutations.ts"

const env = config();

if (!env.PORT) {
    console.error("No enviroment variable: PORT")
    throw Error("No enviroment variable: PORT")
}

const resolvers = {
    CarShop: {
        vendors: CarShopsVendors,
        id: (parent:CarShopSchema) => parent._id.toString() 
    },
    Vendor: {
        cars: VendorsCars,
        id: (parent:VendorSchema) => parent._id.toString() 
    },
    Car: {
        id: (parent: CarSchema) => parent._id.toString()
    },
    Query: {
        getCarById: getCarById,
        getCarInPriceRange: getCarInPriceRange,
        getVendorById: getVendorById,
        getVendorByName: getVendorByName,
        getCarShopById: getCarShopById,
        getCarShopsByCity: getCarShopsByCity
    },
    Mutation: {
        createVendor: createVendor,
        createCar: createCar,
        createCarShop: createCarShop,
        addCarToVendor: addCarToVendor,
        addVendorToCarShop: addVendorToCarShop
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: env.PORT }
});
console.log(`Running on ${url}`)