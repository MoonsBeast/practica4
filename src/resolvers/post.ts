import { RouterContext } from "oak";
import { BookCollection, AuthorCollection, UserCollection } from "../db/database.ts";
import { AuthorSchema, BookSchema, UserSchema } from "../db/schema.ts";
import { ObjectId } from "mongo"

type AddUserContext = RouterContext<"/addUser", Record<string | number, string | undefined>, Record<string, any>>
type AddBookContext = RouterContext<"/addBook", Record<string | number, string | undefined>, Record<string, any>>
type AddAuthorContext = RouterContext<"/addAuthor", Record<string | number, string | undefined>, Record<string, any>>

export const addUser = async (context:AddUserContext) => {

    try {

        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!(value?.name && value?.email && value?.password)) {
            context.response.status = 400;
            context.response.body = { message: "Bad Request" }
            return;
        }

        if (!new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test(value.email)) {
            context.response.status = 422;
            context.response.body = { message: "Bad format on email" }
            return;
        }

        if (await UserCollection.findOne({email: value.email})){
            context.response.status = 409;
            context.response.body = { message: "Already exists" };
            return
        }

        const encoder = new TextEncoder();
        const hashedPassword = await crypto.subtle.digest("SHA-256", encoder.encode(value.password));
        const hashedPasswordString = Array.from(new Uint8Array(hashedPassword)).map(b => b.toString(16).padStart(2, "0")).join("");

        const user : Partial<UserSchema> = {
            name: value.name,
            email: value.email,
            password: hashedPasswordString,
            createdAt: new Date().toString(),
            cart: new Array<ObjectId>
        }

        const id = await UserCollection.insertOne(user as UserSchema);
        context.response.body = {_id: id, ...user}
        
    } catch (error) {
        console.error(error)
    }
    
};

export const addBook = async (context: AddBookContext) => {
    try {

        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!(value?.title && value?.author && value?.pages)) {
            context.response.status = 400;
            context.response.body = { message: "Bad Request" }
            return;
        }

        const author = await AuthorCollection.findOne({ _id: new ObjectId(value.author) })
        if (!author) {
            context.response.status = 404;
            context.response.body = { message: "Author not found" }; 
            return
        }

        const book : Partial<BookSchema> = {
            title: value.title,
            author: new ObjectId(value.author),
            pages: value.pages,
        }

        if (await BookCollection.findOne(book)){
            context.response.status = 409;
            context.response.body = { message: "Book already exists" }; 
            return
        }

        book.ISBN = crypto.randomUUID()

        const bookId = await BookCollection.insertOne(book as BookSchema);

        await AuthorCollection.updateOne({ _id: author._id}, {
            $set: {
                books: author.books.concat(bookId)
            }
        })

        context.response.body = { _id: bookId, ...book}
        
    } catch (error) {
        console.error(error)
    }
    
};

export const addAuthor = async (context: AddAuthorContext) => {
    try {

        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.name) {
            context.response.status = 400;
            context.response.body = { message: "Bad Request" }
            return;
        }

        const id = await AuthorCollection.insertOne({name: value.name, books: new Array<ObjectId>} as AuthorSchema);
        context.response.body = { _id: id, name: value.name }

    } catch (error) {
        console.error(error)
    }

};