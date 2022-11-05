import { User, Transaction } from "../types.ts"
import {ObjectId} from "mongo"

export type UserSchema = User & { _id: ObjectId}
export type TransactionSchema = Transaction & { _id: ObjectId }