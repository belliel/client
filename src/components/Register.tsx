import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ThemeContext } from "../hooks/ThemeContext"
import useAuth from "../hooks/useAuth"
import useInput from "../hooks/useInput"

const Register = () => {
    const { t } = useTranslation()
    const { themeIcon, toggleTheme } = useContext(ThemeContext)

    const name = useInput("")
    const email = useInput("")
    const password = useInput("")
    const phone = useInput("")
    const password_confirm = useInput("")

    const { registerUser } = useAuth()


    const formSubmit = (e: React.FormEvent<HTMLFormElement>)  => {
        e.preventDefault()
        registerUser({
            name: name.value, 
            email: email.value, 
            phone: phone.value, 
            password: password.value, 
            password_confirm: password_confirm.value, 
        })
    }

    return <form onSubmit={formSubmit} className="flex flex-col h-5/6 justify-center items-center space-y-2">
        <div onClick={e => {toggleTheme()}} className="w-4/6 sm:w-3/12 dark:text-gray-200 text-center text-2xl sm:text-3xl font-semibold mb-5 space-x-2">
            <span>{t("register_text")}</span>
            <span>{themeIcon}</span>
        </div>
        <input
            required
            className="w-4/6 sm:w-3/12 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded shadow dark:border-gray-500 border-transparent border-2 outline-none p-2" 
            {...name}
            type="text"
            placeholder={t("name")}
        />
        <input
            required
            className="w-4/6 sm:w-3/12 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded shadow dark:border-gray-500 border-transparent border-2 outline-none p-2" 
            {...email}
            type="email"
            placeholder={t("email")}
        />
        <input
            required
            autoComplete="tel"
            className="w-4/6 sm:w-3/12 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded shadow dark:border-gray-500 border-transparent border-2 outline-none p-2" 
            {...phone}
            type="tel"
            pattern="[0-9]{10}"
            minLength={4}
            placeholder={t("phone") + " 7778880000"} 
        />
        <input
            required
            autoComplete="new-password"
            className="w-4/6 sm:w-3/12 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded shadow dark:border-gray-500 border-transparent border-2 outline-none p-2" 
            {...password}
            type="password"
            placeholder={t("password")}
        />
        <input
            required
            autoComplete="new-password"
            className="w-4/6 sm:w-3/12 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded shadow dark:border-gray-500 border-transparent border-2 outline-none p-2" 
            {...password_confirm}
            type="password"
            placeholder={t("password_confirm")}
        />
        <div className="w-4/6 sm:w-3/12 space-y-2 flex flex-row flex-wrap justify-between items-center">
            <button
                className="dark:bg-pink-800 dark:text-gray-200 text-blue-500 bg-blue-100 hover:bg-blue-200 font-semibold rounded shadow dark:border-pink-900 border-transparent border-2 focus:outline-none outline-none p-2"
            >
                {t("register")}
            </button>
            <Link 
                to="/"
                className="dark:bg-pink-800 dark:text-gray-200 text-blue-500 bg-blue-100 hover:bg-blue-200 font-semibold rounded shadow dark:border-pink-900 border-transparent border-2 focus:outline-none outline-none p-2"
            >
                {t("login")}
            </Link>
        </div>
    </form>
}

export default Register