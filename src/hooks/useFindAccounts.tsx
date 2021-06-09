import { useContext, useEffect, useRef, useState } from "react";
import { instance } from "../helpers/api";
import { accountListInput, API_URI } from "../utils/constants";
import { Account } from "./AccountsContext"
import { Auth } from "./AuthContext";

export default function useFindAccounts() {

    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        
        const findAccounts = async () => {
            setIsLoading(true)

            const auth: Auth = JSON.parse(localStorage.getItem("auth") || "{}") as Auth 

            if (!(auth)) {
                console.info("accounts: no user")
                return
            }

            const data: accountListInput = {
                ids: [],
                user_id: auth.user_id
            }
            await instance.post(`${API_URI}/accounts`, data, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            .then(res => {
                if (Array.isArray(res.data))
                    setAccounts([...(res.data as Account[])])
                else
                    console.error("accounts response not array")

                setIsLoading(false)
            })
            .catch(err => {
                if ((err.response?.data?.error || err.message) === "accounts not found") {
                    console.info("no accounts")
                }

                setIsLoading(false)
            })
        }
        findAccounts()
    }, [])
    
    return {
        accounts,
        setAccounts,
        isLoading,
    }
}