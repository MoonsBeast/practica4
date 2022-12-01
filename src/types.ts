export type CarShop = {
    name: string,
    city: string,
    id: string,
    vendors: Vendor[]
}
export type Vendor = {
    name: string,
    id: string,
    cars: Car[],
}

export type Car = {
    id: string,
    plate: string,
    color: string,
    seats: number,
    model: string,
    price: number
}