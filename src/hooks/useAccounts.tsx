import { useContext, useState } from "react"
import { instance } from "../helpers/api"
import { accountListInput, API_URI, DepositWithdrawInput, FindAccountsInput, transferInput } from "../utils/constants"
import { AccountsContext, Account } from "./AccountsContext"
import { AuthContext } from "./AuthContext"
import { UserContext } from "./UserContext"

export default function useAccounts() {

    const { accounts, setAccounts } = useContext(AccountsContext)
    const [ error, setError ] = useState("")

    const { user } = useContext(UserContext)
    const { auth } = useContext(AuthContext)


    const getAccounts = async () => {
        if (!(user && auth))
            return
        
        const data: accountListInput = {
            ids: user.accounts,
            user_id: auth.user_id
        }

        await instance.post(
            `${API_URI}/accounts`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            }    
        )
        .then(res => {
            if (Array.isArray(res.data))
                setAccounts([...(res.data as Account[])])
            else
                console.error("accounts response not array")

        })
        .catch(err => {
            const error = err.response?.data?.error || err.message
            if (error === "accounts not found") {
                setAccounts([])
                return
            }
            setError(error)
        })
    }

    const createAccount = async (account: Account) => {
        return await instance.post(
            `${API_URI}/accounts/create`,
            account,
            {
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            }
        )
        .then(res => {
            const account = res.data as Account
            setAccounts([...accounts, account])
        })
        .catch(err => {
            console.log(err.response?.data?.error)
            setError(err.response?.data?.error || err.message)
        })
    }

    const transferMoney = async (fromAccount: Account, toAccount: Account, amount: number) => {
        const data: transferInput = {
            from_id: fromAccount.id,
            to_id: toAccount.id,
            amount
        }
        
        return await instance.post(
            `${API_URI}/accounts/transfer`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            }
        )
        .then(res => {
            return res.data
        })
        .catch(err => {
            setError(err.response?.data?.error || err.message)
            return err.response?.data?.error || err.message
        })
    }

    const depositMoney = async (accountId: string, amount: number) => {
        const data: DepositWithdrawInput = {
            account_id: accountId,
            amount
        }

        return await instance.post(
            `${API_URI}/accounts/deposit`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            }
        )
        .then(res => {
            return res.data
        })
        .catch(err => {
            setError(err.response?.data?.error || err.message)
            return err.response?.data?.error || err.message
        })
    }

    const withdrawMoney = async (accountId: string, amount: number) => {
        const data: DepositWithdrawInput = {
            account_id: accountId,
            amount
        }

        return await instance.post(
            `${API_URI}/accounts/withdraw`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            }
        )
        .then(res => {
            return res.data
        })
        .catch(err => {
            setError(err.response?.data?.error || err.message)
            return err.response?.data?.error || err.message
        })
    }

    const findAccounts = async (user_id: string, card_number?: string) => {
        const data: FindAccountsInput = {
            id: user_id,
            card_number: card_number || ""
        }

        return await instance.post(
            `${API_URI}/accounts/find`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            }
        )
        .then(res => [res.data as Account[], null])
        .catch(err => [null, (err.response?.data?.error || err.message) as string])
    }

    return {
        error,
        getAccounts,
        transferMoney,
        depositMoney,
        withdrawMoney,
        findAccounts,
        createAccount
    }
}