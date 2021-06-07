import { createContext, Dispatch, SetStateAction } from "react";

export interface Auth {
    id: string
    user_id: string
    device: string
    user_agent: string
    ip: string
    os: string
    os_version: string
    token: string
    refresh_token: string
    created_at: number
    expires_at: number
}

export const AuthContext = createContext<{
    auth: Auth | null;
    setAuth: Dispatch<SetStateAction<Auth | null>>;
}>({
    auth: null,
    setAuth: () => { },
});