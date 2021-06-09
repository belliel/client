import React, { useContext, useState, useEffect } from "react"
import { useParams } from "react-router"
import { AccountsContext, Account, AccountType, Currency } from "../hooks/AccountsContext"
import useAccounts from "../hooks/useAccounts"
import history from "../helpers/history"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import useInput from "../hooks/useInput"



const Withdraw = () => {
    const { id } = useParams<{id: string}>()
    const { t } = useTranslation()

    const { accounts, isLoading: accountsIsLoading } = useContext(AccountsContext)
    const { getAccounts, withdrawMoney } = useAccounts()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ account, setAccount ] = useState<Account>()

    const [ error, setError ] = useState("")
    const amount = useInput("0")
    
    const sendTransAction = async () => {
        const amountValue = parseFloat(amount.value)

        if (isNaN(amountValue) || amountValue <= 0) {
            setError("invalid_amount")
            return
        }

        if (!account) {
            setError("account_invalid")
            return
        }

        if (account.balance - amountValue < 0) {
            setError("low_balance")
            return
        }

        const resp = await withdrawMoney(account.id, amountValue)
        if (resp.success) {
            setError("")
            setAccount({...account, balance: account.balance - amountValue})
        } else {
            setError(resp)
        }
        await getAccounts()
    }

    useEffect(() => {
        const _ = async () => {
            setIsLoading(true)
            await getAccounts()
            setAccount(accounts.find(a => a.id === id))
            setIsLoading(false)
        }
        _()
    }, [id, accountsIsLoading])

    return <div className="flex flex-col space-y-4 p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
        <div className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-3 outline-none space-y-2">
            <button 
                onClick={e => history.goBack()}
                className="p-2 shadow rounded dark:bg-gray-500 bg-blue-400 text-white font-semibold"
            >
                ↩️ {t("back")}
            </button>
            {
                isLoading ? <div className="flex flex-row justify-center font-semibold">
                    {t("loading")}
                </div> : <></>
            }
            {
                !account ? <>
                    <div className="flex flex-row justify-center font-semibold">
                        <span className="text-center">
                            {t("account_not_found")}
                        </span>
                    </div>
                    <div className="flex flex-row justify-between font-semibold">
                        <button
                            className="shadow rounded bg-transparent dark:bg-gray-500 bg-blue-400 text-white py-1 px-4 focus:outline-none outline-none font-semibold"
                            onClick={getAccounts}    
                        >
                            {t("refresh")}
                        </button>
                        <Link 
                            className="shadow rounded bg-transparent dark:bg-gray-500 bg-blue-400 text-white py-1 px-4 focus:outline-none outline-none font-semibold"
                            to="/"
                        >
                            {t("to_dashboard")}
                        </Link>
                    </div>
                </> : <form 
                    onSubmit={e => e.preventDefault()}
                    className="flex flex-col justify-between items-center p-4 space-y-2 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300"
                >
                    <div className="flex flex-row w-full justify-between items-center font-semibold shadow rounded p-2 mx-3 dark:bg-gray-500 bg-blue-400 text-white">
                        <span>
                            {t(AccountType[account.type])}
                        </span>
                    </div>
                    <div className="flex flex-row w-full justify-between items-center font-semibold shadow rounded p-2 mx-3 dark:bg-gray-500 bg-blue-400 text-white">
                        <span>
                            {account.card_type} {account.card_number.split("").filter((_, i) => i > account.card_number.length - 5).join("")}
                        </span>
                        <span>
                            {account.balance.toFixed(2)} {Currency[account.currency]}
                        </span>
                    </div>
                    <div className="flex flex-col w-full justify-between items-center font-semibold shadow rounded p-2 mx-3 space-y-0 dark:bg-gray-400 bg-blue-400 text-white">
                        <span className="w-full text-sm mb-3">
                            {t("amount")}
                        </span>
                        <input
                            className="w-full py-2 px-2 bg-transparent text-white outline-none shadow rounded dark:bg-gray-500 bg-blue-300"
                            required
                            type="number"
                            {...amount}
                        />
                    </div>
                    <div className="flex flex-col w-full justify-between items-center font-semibold shadow rounded p-2 mx-3 space-y-0 dark:bg-gray-400 bg-blue-400 text-white">
                        <button 
                            onClick={sendTransAction}
                            className="w-full py-2 px-2 bg-transparent text-white focues:outline-none outline-none shadow rounded dark:bg-gray-500 bg-blue-300 font-semibold">
                            {t("withdraw")}
                        </button>
                    </div>
                    <div className={`${error ? "flex" : "hidden"}  flex-col w-full justify-between items-center font-semibold shadow rounded p-2 mx-3 space-y-0 dark:bg-gray-400 bg-blue-400 text-white`}>
                        <span className="font-semibold">
                            {error}
                        </span>
                    </div>
                </form>
            }
        </div>
    </div>
}

export default Withdraw