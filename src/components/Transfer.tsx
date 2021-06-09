import React, { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import history from "../helpers/history"
import { normalize } from "../helpers/money"
import { Account, AccountsContext, AccountType, Currency } from "../hooks/AccountsContext"
import useAccounts from "../hooks/useAccounts"
import useInput from "../hooks/useInput"
import { User, UserContext } from "../hooks/UserContext"
import useUsers from "../hooks/useUsers"

const Transfer = () => {

    enum transferTypes {
        not_setted,
        via_in_user,
        via_bank_client,
        via_card,
    }

    const transferIcons = [
        "↩️",
        "🔄",
        "👤",
        "💳",
    ]


    const { t } = useTranslation()
    const { id } = useParams<{id: string}>()

    const { user } = useContext(UserContext)
    const { accounts, isLoading: accountsIsLoading } = useContext(AccountsContext)
    const [ isLoading, setIsLoading ] = useState(false)
    const { getAccounts, transferMoney, findAccounts } = useAccounts()

    const [ account, setAccount ] = useState<Account>()
    const [ pickedAccount, setPickedAccount ] = useState<string>()
    const [ transferType, setTransferType ] = useState<transferTypes>(transferTypes.not_setted)
    const [ minAmount, setMinAmount ] = useState(Infinity)
    const [ error, setError ] = useState("")

    const { findUser, getUser } = useUsers()
    const [ findedAccounts, setFindedAccounts ] = useState<Account[]>([])
    const [ findedUser, setFindedUser ] = useState<User>()
    const [ isFindedAccountsLoading, setFindedAccountsLoading ] = useState(false)

    const destination = useInput("")
    const amount = useInput("0")
    
    useEffect(() => {
        const _ = async () => {
            setIsLoading(true)
            await getAccounts()
            setAccount(accounts.find(a => a.id === id))
            setIsLoading(false)
        }
        _()
    }, [id, accountsIsLoading])

    useEffect(() => {
        const _ = async () => {
            if (transferType === transferTypes.via_bank_client && [10].includes(destination.value.length) && user?.phone !== destination.value) {
                setFindedAccountsLoading(true)
                const [_user, error] = await findUser("", destination.value)
                setError(error as string)
                
                if ((_user as User)?.id) {
                    setFindedUser(_user as User)
                    const [_findedAccounts, accountsError] = await findAccounts((_user as User).id)
                    setError(accountsError as string)
                    if (_findedAccounts) {
                        setFindedAccounts(_findedAccounts as Account[])
                    }
                }
                
                setFindedAccountsLoading(false)
            } else if (transferType === transferTypes.via_card && destination.value.length > 10 && accounts.findIndex(a => a.card_number === destination.value) === -1) {
                setFindedAccountsLoading(true)
                const [_findedAccounts, accountsError] = await findAccounts("", destination.value)
                setError(accountsError as string)
                if (_findedAccounts) {
                    setFindedAccounts(_findedAccounts as Account[])
                    const [_user, error] = await getUser((_findedAccounts as Account[])[0]?.user_id)
                    setError(error as string)
                    setFindedUser(_user as User)
                }
                setFindedAccountsLoading(false)
            } else if (destination.value.length < 9) {
                if (findedAccounts.length) {
                    setFindedAccounts([])
                }
                if (error) {
                    setError("")
                }
            }
        }
        _()
    }, [destination.value])

    const sendTransAction = async () => {
        setError("")

        const fromAccount = account
        const toAccount = (
            transferType === transferTypes.via_in_user ? accounts.find(a => a.id === pickedAccount) :
            transferType === transferTypes.via_bank_client || transferType === transferTypes.via_card ? findedAccounts.find(a => a.id === pickedAccount)
            : undefined
        )
        const amountValue = parseFloat(amount.value)

        if (!toAccount) {
            setError("destination_not_picked")
        }

        if (!(fromAccount && toAccount && (!isNaN(amountValue+1)))) {
            console.error("something went wrong")
            console.table([fromAccount, toAccount])
            return
        }

        const _minAmount = (
            fromAccount.currency === Currency.KZT ? 100.00 :
            fromAccount.currency === Currency.USD ? 0.50 :
            fromAccount.currency === Currency.EUR ? 0.50 :
            Infinity
        )

        if (amountValue < _minAmount) {
            setError("minimum_is")
            setMinAmount(_minAmount)
            return
        }


        const accountBalance = normalize(fromAccount.balance, fromAccount.currency)
        const sendAmount = normalize(amountValue, fromAccount.currency)

        if (sendAmount > accountBalance) {
            setError("not_enough_balance")
            return
        }

        const res = await transferMoney(fromAccount, toAccount, parseFloat(amount.value))
        getAccounts()
        
        if (res.success) {
            setError("")
            setAccount({...fromAccount, balance: fromAccount.balance - amountValue})
        } else {
            setError(res)
        }
    }


    return <div className="flex flex-col space-y-4 p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
        <div className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-3 outline-none space-y-2">
            <button 
                onClick={e => history.goBack()}
                className="p-2 shadow rounded dark:bg-gray-500 bg-blue-400 text-white font-semibold"
            >
                {transferIcons[transferTypes.not_setted]} {t("back")}
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
                </> : <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-between items-center p-4 space-y-2 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
                    {
                        transferType === transferTypes.not_setted ? Object.keys(transferTypes)
                            .filter(type => !isNaN(parseInt(type)))
                            .map(t => parseInt(t))
                            .filter(t => t > 0)
                            .map(v => <button
                                key={v}
                                className="flex flex-col w-full text-center font-semibold shadow rounded p-2 mx-3 dark:bg-gray-500 bg-blue-400 text-white"
                                onClick={e => setTransferType(v)}
                            >
                                {transferIcons[v]} {t(transferTypes[v])}
                            </button>)
                        : <>
                            <div className="flex flex-row w-full justify-between items-center font-semibold mx-3">
                                <button 
                                    onClick={e => setTransferType(transferTypes.not_setted)}
                                    className="p-2 shadow rounded dark:bg-gray-500 bg-blue-400 text-white font-semibold"
                                >
                                    {transferIcons[transferTypes.not_setted]} {t("back")}
                                </button>
                            </div>
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

                            <div className="flex flex-col w-full justify-between items-center font-semibold shadow rounded p-2 mx-3 dark:bg-gray-500 bg-blue-400 text-white">
                                <span className="w-full text-sm mb-3">
                                    {
                                        transferType === transferTypes.via_in_user ? t("pick_account") :
                                        transferType === transferTypes.via_bank_client ? t("number") :
                                        transferType === transferTypes.via_card ? t("card_number") :
                                        ""
                                    }
                                </span>
                                {
                                    transferType === transferTypes.via_in_user ? <>
                                        {
                                            accounts.filter(a => a.id !== account.id).map(a => <button
                                                key={a.id}
                                                onClick={e => setPickedAccount(a.id)}
                                                className={`${pickedAccount === a.id ? "dark:bg-gray-400 bg-blue-200" : ""} flex flex-row w-full justify-between items-center font-semibold p-2 mx-3 border-b-2 dark:border-gray-400 border-blue-200 text-white focus:outline-none outline-none`}>
                                                <span>
                                                    {a.card_type} {a.card_number.split("").filter((_, i) => i > a.card_number.length - 5).join("")}
                                                </span>
                                                <span>
                                                    {a.balance.toFixed(2)} {Currency[a.currency]}
                                                </span>
                                            </button>)
                                        }
                                    </> : <>
                                        {
                                            findedAccounts?.filter(a => a.id !== account.id).map((a, i) => <button
                                                key={a.id}
                                                onClick={e => setPickedAccount(a.id)}
                                                className={`${pickedAccount === a.id ? "dark:bg-gray-400 bg-blue-200" : ""} flex flex-col w-full font-semibold p-2 mx-3 border-b-2 dark:border-gray-400 border-blue-200 text-white focus:outline-none outline-none`}>
                                                <div className="flex flex-row w-full justify-between items-center">
                                                    <span>
                                                        {a.card_type} {a.card_number.split("").filter((_, i) => i > a.card_number.length - 5).join("")}
                                                    </span>
                                                    <span>
                                                        {"••"} {Currency[a.currency]}
                                                    </span>
                                                </div>
                                                <div className="flex flex-row w-full justify-between items-center">
                                                    <span className="text-gray-200 text-sm">
                                                        {findedUser?.name}
                                                    </span>
                                                </div>
                                            </button>)
                                        }
                                        <input 
                                            required
                                            className={`${findedAccounts?.length ? "mt-4" : ""} w-full outline-none shadow rounded px-3 py-1 dark:bg-gray-600 dark:text-white text-white font-semibold`}
                                            style={{appearance: "none"}}
                                            pattern={
                                                transferType === transferTypes.via_bank_client ? "[0-9]{10}" :
                                                transferType === transferTypes.via_card ? "[0-9]{16,19}" : 
                                                undefined
                                            }
                                            type="number"
                                            {...destination}
                                        />
                                    </>
                                }
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
                                    {t("send")}
                                </button>
                            </div>
                            <div className={`${error ? "flex" : "hidden"}  flex-col w-full justify-between items-center font-semibold shadow rounded p-2 mx-3 space-y-0 dark:bg-gray-400 bg-blue-400 text-white`}>
                                <span className="font-semibold">
                                    {t(error)} {error === "minimum_is" ? minAmount + " " + Currency[account.currency]: ""}
                                </span>
                            </div>
                        </>
                    }
                </form>
            }
        </div>
    </div>
}

export default Transfer