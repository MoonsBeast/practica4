import { ObjectId } from "mongo"

export type User = {
    name: string,
    email: string,
    password: string,
    createdAt : string,
    cart : ObjectId[]
}

export type Book = {
    title: string,
    author: ObjectId
    pages: number,
    ISBN: string
}

export type Author = {
    name: string,
    books: ObjectId[]
}