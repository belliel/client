import { useEffect, useState } from "react"
import { Auth } from "./AuthContext"

export default function useFindAuth() {

    const [auth, setAuth] = useState<Auth|null>(null)

    useEffect(() => {
        const _ = async () => {
            const authData: Auth = JSON.parse(localStorage.getItem("auth") || "{}") as Auth
            setAuth(authData)
        }
        _()
    }, [])

    return {
        auth,
        setAuth
    }
}