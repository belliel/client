import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { AccountsContext, AccountType, Currency } from "../hooks/AccountsContext"
import useAccounts from "../hooks/useAccounts"
import { UserContext } from "../hooks/UserContext"



const Dashboard = () => {
    const { t } = useTranslation()

    const { user } = useContext(UserContext)
    const { accounts, isLoading: accountIsLoading } = useContext(AccountsContext)
    const { getAccounts } = useAccounts()
    const [ expanded, setExpanded ] = useState(false)

    useEffect(() => {
        getAccounts()
    }, [])


    return <div className="flex flex-col space-y-4 p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
        <button
            onClick={e => setExpanded(!expanded)}
            className="w-1/6 shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-1 focus:outline-none outline-none"
        >
            {expanded ? "👁‍🗨" : "⏹"}
        </button>
        {
            accountIsLoading ? <div className="p-2 font-semibold text-gray-50 text-center">
                {t("loading")}
            </div> : !accounts.length ? <Link to="/account" className="rounded shadow p-2 font-semibold text-center dark:text-gray-50 text-gray-700 dark:bg-gray-500 bg-blue-200 ">
                {t("no_accounts_try_to_add")}
            </Link> : [accounts.sort((a1, a2) => a1.created_at - a2.created_at)[0]].map(account => <Link 
                className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-3 outline-none"
                key={account.id}
                to={`/account/${account.id}`}
            >
                <div className="flex flex-row justify-between font-semibold">
                    {t(AccountType[account.type].toLowerCase())}
                </div>
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
                <div className="dark:text-gray-300 text-gray-500 font-semibold">
                    {
                        account.card_number.split("").map((v, i) => {
                            let text = ""
                            text += i < account.card_number.length - 4 ? "•" : v
                            text += i % 4 === 0 && i > 0 ? " " : ""
                            return text
                        })
                    }
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
            </Link>) 
        }
        {
            expanded ? <>
                {
                    accounts.sort((a1, a2) => a1.created_at - a2.created_at).map((account, index) => index > 0 ? <Link 
                        className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-3 outline-none"
                        key={account.id}
                        to={`/account/${account.id}`}
                    >
                        <div className="flex flex-row justify-between font-semibold">
                            {t(AccountType[account.type].toLowerCase())}
                        </div>
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
                        <div className="dark:text-gray-300 text-gray-500 font-semibold">
                            {
                                account.card_number.split("").map((v, i) => {
                                    let text = ""
                                    text += i % 4 === 0 && i > 0 ? " " : ""
                                    text += i < account.card_number.length - 4 ? "•" : v
                                    return text
                                })
                            }
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
                    </Link> : <></>)
                }
                {
                    Object.keys(Currency)
                        .filter(c => !isNaN(parseInt(c)))
                        .map(c => accounts.filter(a => a.type !== AccountType.Deposit).findIndex(a => a.currency !== parseInt(c)))
                        .includes(0) ? <Link key={"new-account"} to="/account" className="rounded shadow p-2 font-semibold text-center dark:text-gray-50 text-gray-700 dark:bg-gray-500 bg-blue-200 ">
                        {t("add")}
                    </Link> : <></>
                }
            </> : <></>
        }
    </div>
}


export default Dashboard