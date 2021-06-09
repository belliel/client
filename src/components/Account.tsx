import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router-dom"
import { Account, AccountsContext, AccountType, Currency, getZeroValueAccount } from "../hooks/AccountsContext"
import useAccounts from "../hooks/useAccounts"
import { UserContext } from "../hooks/UserContext"

const AccountComponent = () => {

    const { id } = useParams<{id?: string}>()
    const { t } = useTranslation()

    const { accounts, isLoading: accountsIsLoading } = useContext(AccountsContext)
    const { user } = useContext(UserContext)
    const { getAccounts } = useAccounts()
    const [ account, setAccount ] = useState<Account|undefined>(getZeroValueAccount())
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        const _ = async () => {
            setIsLoading(true)
            const a = accounts.find(a => a.id === id)
            setAccount(a)
            setIsLoading(false)
        }
        _()
    }, [accounts, id, accountsIsLoading])

    return <>
        <div className="flex flex-col space-y-4 p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
            {
                !account ? <div className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-3 outline-none space-y-2">
                    <div className="flex flex-row justify-center font-semibold">
                        <span className="text-center">
                            {t("account_not_found")}
                        </span>
                    </div>
                    <div className="flex flex-row justify-between font-semibold">
                        <button
                            className="shadow rounded bg-transparent dark:bg-gray-500 bg-blue-300 py-1 px-4 focus:outline-none outline-none font-semibold"
                            onClick={getAccounts}    
                        >
                            {t("refresh")}
                        </button>
                        <Link 
                            className="shadow rounded bg-transparent dark:bg-gray-500 bg-blue-300 py-1 px-4 focus:outline-none outline-none font-semibold"
                            to="/"
                        >
                            {t("to_dashboard")}
                        </Link>
                    </div>
                </div> : <div className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-3 outline-none">
                    <div className="flex flex-row justify-between font-semibold">
                        <span>
                            {Currency[account.currency]}
                        </span>
                        <span>
                            {account.card_type}
                        </span>
                    </div>
                    <div className="dark:text-gray-300 text-gray-500 font-semibold">
                        {account.balance.toFixed(2)}
                    </div>
                    <div className="flex flex-row justify-between items-center flex-wrap dark:text-gray-300 text-gray-500 font-semibold">
                        <span>
                            {
                                account.card_number.split("").map((v, i) => {
                                    let text = ""
                                    text += i % 4 === 0 && i !== 0 ? " " : ""
                                    text += v
                                    return text
                                })
                            }
                        </span>
                        <span>
                            CVV {account.cvv}
                        </span>
                    </div>
                    <div className="flex flex-row justify-between items-center dark:text-gray-200 text-gray-500 font-semibold">
                        <span>
                            {user?.name.toUpperCase()}
                        </span>
                        <span className="space-x-1">
                            <span>
                                {new Date(account.expire_date * 1000).getMonth() > 9 ? "" : "0"}{new Date(account.expire_date * 1000).getMonth()}
                            </span>
                            <span>
                                /
                            </span>
                            <span>
                                {new Date(account.expire_date * 1000).getFullYear().toString().split("").filter((_, i) => i > 1).join("")}
                            </span>
                        </span>
                    </div>
                    <div className="mt-5 flex flex-row justify-between items-center dark:text-gray-200 text-gray-500 font-semibold">
                        <span>
                            {t("bik")}
                        </span>
                        <span>
                            {account.number}
                        </span>
                    </div>
                    <div className="flex flex-row justify-between items-center dark:text-gray-200 text-gray-500 font-semibold">
                        <span>
                            {t("iban")}
                        </span>
                        <span>
                            {account.iban}
                        </span>
                    </div>
                    {
                        account.type === AccountType.Deposit ? <>
                            <div className="flex flex-row justify-between items-center dark:text-gray-200 text-gray-500 font-semibold">
                                <span>
                                    {t("sum_deposit")}
                                </span>
                                <span>
                                    {account.deposit_cap.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex flex-row justify-between items-center dark:text-gray-200 text-gray-500 font-semibold">
                                <span>
                                    {t("end_deposit")}
                                </span>
                                <span>
                                    {new Date(account.deposit_end_date * 1000).getDay() > 9 ? "" : "0"}{new Date(account.deposit_end_date * 1000).getDay()}.
                                    {new Date(account.deposit_end_date * 1000).getMonth() > 9 ? "" : "0"}{new Date(account.deposit_end_date * 1000).getMonth()}.
                                    {new Date(account.deposit_end_date * 1000).getFullYear()}
                                </span>
                            </div>
                        </> : <></>
                    }
                </div>
            }
        </div>
        <div className="flex flex-row justify-between items-center p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
            {
                account ? <>
                    <Link 
                        className="flex flex-col w-1/3 text-center font-semibold shadow rounded p-1 mx-2 dark:bg-gray-500 dark:text-gray-50 text-gray-700"
                        to={`/transfer/${account.id}`}
                    >
                        <span>
                            {t("transfer")}
                        </span>
                        <span>
                            🔁
                        </span>
                    </Link>

                    <Link 
                        className="flex flex-col w-1/3 text-center font-semibold shadow rounded p-1 mx-2 dark:bg-gray-500 dark:text-gray-50 text-gray-700"
                        to={`/withdraw/${account.id}`}
                    >
                        <span>
                            {t("withdraw")}
                        </span>
                        <span>
                            🔽
                        </span>
                    </Link>

                    <Link 
                        className="flex flex-col w-1/3 text-center font-semibold shadow rounded p-1 mx-2 dark:bg-gray-500 dark:text-gray-50 text-gray-700" 
                        to={`/deposit/${account.id}`}
                    >
                        <span>
                            {t("deposit")}
                        </span>
                        <span>
                            💹
                        </span>
                    </Link>
                </> : <></> 
            }
        </div>
        <div className="flex flex-col space-y-4 p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
            {
                
            }
        </div>
    </>
}

export default AccountComponent