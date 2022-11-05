export type User = {
    DNI: string,
    email: string,
    name: string,
    surname: string,
    telephone : string,
    IBAN : string
}

export type Transaction = {
    ID_Sender: string,
    ID_Receiver: string
    amount: number
}