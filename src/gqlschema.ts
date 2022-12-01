import { gql } from "graphql_tag"

export const typeDefs = gql`
type CarShop {
    name: String!,
    city: String!,
    id: String!,
    vendors: [Vendor!]!
}

type Vendor {
    name: String!,
    id: String!,
    cars: [Car!]!,
}

type Car {
    id: String!,
    plate: String!,
    color: String!,
    seats: Int!,
    price: Float!
    model: String!
}

type Query{
    getCarById(id:String!) : Car
    getCarInPriceRange(min: Float!, max: Float!) : [Car!]!,
    getVendorById(id:String!) : Vendor
    getVendorByName(name:String!) : [Vendor!]!
    getCarShopById(id:String!) : CarShop
    getCarShopsByCity(city:String!,page:Int!) : [CarShop!]!
}

type Mutation{
    createVendor(name:String!) : Vendor!
    createCar(plate:String!,color:String!,seats:Int!,model:String!,price:Float!) : Car!
    createCarShop(name:String!, city:String!) : CarShop!
    addCarToVendor(vendor:String!,car:String!) : Vendor!
    addVendorToCarShop(carshop:String!,vendor:String!) : CarShop!
}
`