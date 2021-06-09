import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ThemeContext } from "../hooks/ThemeContext"
import useAuth from "../hooks/useAuth"
import useInput from "../hooks/useInput"


const Login = () => {
    const { t } = useTranslation()
    const { themeIcon, toggleTheme } = useContext(ThemeContext)

    const username = useInput("")
    const password = useInput("")
    const { loginUser } = useAuth()

    const formSubmit = (e: React.FormEvent<HTMLFormElement>)  => {
        e.preventDefault()
        loginUser({
            username: username.value, 
            password: password.value, 
        })
    }

    return <form onSubmit={formSubmit} className="flex flex-col h-5/6 justify-center items-center space-y-2">
        <div onClick={toggleTheme} className="w-4/6 sm:w-3/12 dark:text-gray-200 text-center text-2xl sm:text-3xl font-semibold mb-5 space-x-2">
            <span>{t("login_text")}</span>
            <span>{themeIcon}</span>
        </div>
        <input
            required 
            autoComplete="username"
            className="w-4/6 sm:w-3/12 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded shadow dark:border-gray-500 border-transparent border-2 outline-none p-2" 
            {...username} 
            type="text" 
            placeholder={t("username")} 
        />
        <input
            required
            autoComplete="current-password"
            className="w-4/6 sm:w-3/12 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded shadow dark:border-gray-500 border-transparent border-2 outline-none p-2" 
            {...password} 
            type="password" 
            placeholder={t("password")} 
        />
        <div className="w-4/6 sm:w-3/12 flex flex-row flex-wrap justify-between items-center">
            <button 
                className="dark:bg-pink-800 dark:text-gray-200 text-blue-500 bg-blue-100 hover:bg-blue-200 font-semibold rounded shadow dark:border-pink-900 border-transparent border-2 focus:outline-none outline-none p-2"
            >
                {t("login")}
            </button>
            <Link 
                to="/register"
                className="dark:bg-pink-800 dark:text-gray-200 text-blue-500 bg-blue-100 hover:bg-blue-200 font-semibold rounded shadow dark:border-pink-900 border-transparent border-2 focus:outline-none outline-none p-2"
            >
                {t("register")}
            </Link>
        </div>
    </form>
}

export default Login