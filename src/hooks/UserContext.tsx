import { createContext, Dispatch, SetStateAction } from "react";

export interface User {
    id: string
    name: string
    email: string
    phone: string
    password: string
    picture: string
    accounts: string[]
    saved_accounts: string[]
    created_at: bigint
}

export const UserContext = createContext<{
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    isLoading: boolean;
}>({
    user: null,
    setUser: () => { },
    isLoading: false,
});