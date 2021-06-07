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

