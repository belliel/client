import { useContext, useRef } from "react"
import { useTranslation } from "react-i18next"
import { ThemeContext } from "../hooks/ThemeContext"
import useAuth from "../hooks/useAuth"
import { UserContext } from "../hooks/UserContext"



const Settings = () => {
    const { user } = useContext(UserContext)
    const { theme, themeIcon, toggleTheme } = useContext(ThemeContext)

    const { logOut } = useAuth()
    const { t, i18n } = useTranslation()
    

    const locales = [
        { value: "ru", naming: "russian" },
        { value: "kz", naming: "kazakh"  },
        { value: "en", naming: "english" },
    ]

    const locale = locales.find(l => l.value === i18n.language.split("-")[0])

    return <div className="flex flex-col space-y-4 p-4 rounded shadow dark:bg-gray-600 dark:text-gray-200 bg-blue-300">
        {
            user ? <>
                <div className="flex flex-col justify-center items-center text-gray-500 font-semibold text-2xl min-w-max p-2 w-16 h-16 mx-auto mb-5 rounded-2xl shadow bg-gray-200">
                    {
                        user.name.split(" ").map(n => n.length ? n.charAt(0).toUpperCase() : "").join("")
                    }
                </div>        
        
                <button 
                    className="p-2 rounded shadow bg-red-300 text-white font-semibold"
                    onClick={e => logOut()}>
                    🚪 {t("logout")}
                </button>
            </> : <></>
        }
        <div className="flex flex-row w-full justify-between items-center font-semibold text-gray-600 dark:text-gray-200">
            <span>
                {t("language")} 🌐
            </span>
            <select
                onChange={e => i18n.changeLanguage(e.target.value)}
                className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 p-1 outline-none font-semibold">
                {
                    locale ? <option className="text-gray-700" value={locale.value}>{locale.naming}</option> : <></>
                }
                {
                    locales.filter(l => l.value !== locale?.value).map(l => <option className="text-gray-700" key={l.value} value={l.value}>{l.naming}</option>)
                }
            </select>
        </div>
        <div className="flex flex-row w-full justify-between items-center font-semibold text-gray-600 dark:text-gray-200">
            <span>
                {t("theme")} {themeIcon}
            </span>
            <button 
                className="shadow rounded bg-transparent dark:bg-gray-400 bg-blue-200 py-1 px-4 focus:outline-none outline-none font-semibold"
                onClick={e => toggleTheme()}    
            >
                {t(theme as string)}
            </button>
        </div>
    </div>
}


export default Settings