import { useContext, useEffect, useState } from "react"
import useAccounts from "../hooks/useAccounts"
import { Account, AccountsContext, AccountType, Currency, getZeroValueAccount } from "../hooks/AccountsContext";
import { useTranslation } from "react-i18next";
import history from "../helpers/history"


const NewAccount = () => {
    const { t } = useTranslation()
    const { createAccount } = useAccounts()

    const { accounts } = useContext(AccountsContext)
    const [account, setAccount] = useState<Account>(getZeroValueAccount())
    const [error, setError] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [canMake, setCanMake] = useState<AccountType[]>([AccountType.Debit, AccountType.Deposit])

    useEffect(() => {
        if (Object.keys(Currency)
            .filter(c => !isNaN(parseInt(c)))
            .map(c => parseInt(c))
            .filter(c => accounts.findIndex(a => a.currency === c) === -1)
            .filter(c => account.type === AccountType.Deposit ? c === Currency.KZT : true).length === 0) {
                setCanMake([AccountType.Deposit])
                setAccount({...account, type: AccountType.Deposit})
        } else {
            const availableCurrencies = Object.keys(Currency)
            .filter(c => !isNaN(parseInt(c)))
            .map(c => parseInt(c))
            .filter(c => accounts.findIndex(a => a.currency === c) === -1)
            if (availableCurrencies.length) {
                setAccount({...account, currency: availableCurrencies[0]})
            }
        }
    }, [])

    return <div className="flex flex-col space-y-4 p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
        <div className="flex flex-row justify-between items-center">
            <span className="">
                {t("account_type")} 🌀
            </span>
            <select 
                className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-1 outline-none"
                onChange={e => setAccount({...account, type: parseInt(e.target.value) as AccountType})}
            >
                {
                    canMake
                        .map(c => <option
                            className="text-gray-700"
                            key={c}
                            value={c}
                        >
                            {t(AccountType[c].toLowerCase())}
                        </option>)
                }
            </select>
        </div>
        <div className="flex flex-row justify-between items-center">
            <span>
                {t("currency")} 💵
            </span>
            <select 
                className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-1 outline-none"
                onChange={e => setAccount({...account, currency: parseInt(e.target.value) as Currency})}
            >
                {
                    account.type === AccountType.Debit ? Object.keys(Currency)
                        .filter(c => !isNaN(parseInt(c)))
                        .map(c => parseInt(c))
                        .filter(c => accounts.findIndex(a => a.currency === c) === -1)
                        .map(c => <option 
                            className="text-gray-700"
                            key={c}
                            value={c}
                        >
                            {Currency[c]}
                        </option>) : <></>
                }

                {
                    account.type === AccountType.Deposit ? <option 
                        className="text-gray-700"
                        key={Currency.KZT}
                        value={Currency.KZT}
                    >
                           
                        {Currency[Currency.KZT]}
                    </option> : <></>
                }
            </select>
        </div>
        {
            account.type === AccountType.Deposit ?  <>
                <div className="flex flex-row justify-between items-center">
                    <span>
                        {t("sum")} 🔗
                    </span>
                    <input
                        required
                        onChange={e => setAccount({...account, deposit_cap: parseInt(e.target.value)})}
                        value={account.deposit_cap}
                        placeholder="0"
                        style={{appearance: "textfield"}}
                        className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-1 focus:outline-none outline-none"
                        type="number"
                    />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <span>
                        {t("months")} 📅
                    </span>
                    <div className="flex flex-row space-x-1">
                        {
                            [6, 12, 24].map(m => <button
                                onClick={e => setAccount({...account, deposit_end_date: m})}
                                key={m}
                                className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 font-semibold p-1 w-12 focus:outline-none outline-none"
                                type="button"
                                value={m}
                            >{m}</button>)
                        }
                    </div>
                </div>
            </> : <></>
        }
        <div className="flex flex-row justify-between items-center">
            <button
                disabled={isSaving}
                onClick={async e => {
                    setIsSaving(true)
                    await createAccount(account)
                    setIsSaving(false)
                    history.push("/", "push")
                }}
                className="shadow rounded bg-transparent dark:bg-green-400 bg-green-200 dark:text-gray-700 font-semibold p-1 focus:outline-none outline-none"
                type="button"
            >
                {t("create")}
            </button>
        </div>
    </div>
}


export default NewAccount