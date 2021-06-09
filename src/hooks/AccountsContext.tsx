import { createContext, Dispatch, SetStateAction } from "react";

export enum Currency {
    KZT,
    EUR,
    USD,
}

export enum AccountType {
    Default,
    Loan,
    Debit,
    Deposit,
}

export interface Account {
    id: string
    user_id: string
    type: AccountType
    currency: Currency
    balance: number
    number: string
    iban: string
    card_number: string
    card_type: string
    cvv: string
    created_at: number
    expire_date: number
    deposit_cap: number
    deposit_end_date: number
    loan_cap: number
}

export const getZeroValueAccount = (): Account => {
    return {
        id: "",
        user_id: "",
        type: AccountType.Debit,
        currency: Currency.KZT,
        balance: 0,
        number: "",
        iban: "",
        card_number: "",
        card_type: "",
        cvv: "",
        created_at: 0,
        expire_date: 5,
        deposit_cap: 0,
        deposit_end_date: 6,
        loan_cap: 0,
    }
}

export const AccountsContext = createContext<{
    accounts: Account[],
    setAccounts: Dispatch<SetStateAction<Account[]>>;
    isLoading: boolean;
}>({
    accounts: [],
    setAccounts: () => { },
    isLoading: false,
})