export const DEFAULT_URI = "http://localhost:8000"
export const API_URI = `${DEFAULT_URI}/api`

export interface signUpInput {
    name: string
    email: string
    phone: string
    password: string
    password_confirm: string
}

export interface signInInput {
    username: string
    password: string
}

export interface forgetPasswordInput {
    email: string
}

export interface restorePasswordInput {
    code: string
    password: string
    password_confirm: string
}

export interface accountListInput {
    ids: string[],
    user_id: string,
}

export interface transferInput {
    from_id: string
    to_id: string
    amount: number
}

export interface DepositWithdrawInput {
    account_id: string,
    amount: number,
}

export interface FindUserInput {
    email: string
    phone: string
}

export interface FindAccountsInput {
    id: string
    card_number: string
}
