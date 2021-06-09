import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import history from "../helpers/history";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../hooks/ThemeContext";
import { UserContext } from "../hooks/UserContext"

const Header = () => {

    const { user } = useContext(UserContext)
    const { themeIcon, toggleTheme } = useContext(ThemeContext)

    const { t } = useTranslation()
    const [inSettings, setInSettings] = useState(false)
    const [inOtherMenu, setInOtherMenu] = useState(false)

	useEffect(() => {
		const unlisten = history.listen((location, action) => {
            setInSettings(location.pathname.toLowerCase() !== "/settings")
            setInOtherMenu(history.location.pathname.toLowerCase() !== "/")
		})
        setInSettings(history.location.pathname.toLowerCase() !== "/settings")
        setInOtherMenu(history.location.pathname.toLowerCase() !== "/")
		
        return () => {
			unlisten()
		}
	}, [])

    return <div className="h-16">
        <div className="rounded shadow dark:bg-gray-700 dark:text-gray-200 bg-blue-400 text-white font-semibold h-full flex flex-row justify-between items-center px-4">
            
            {
                inSettings ? <Link 
                    className={`w-1/3 h-full flex-col justify-center items-center flex`} to="/settings"
                >
                    ⚙️ {t("settings")}
                </Link> : <button 
                    className={`w-1/3 h-full flex-col justify-center items-center flex focus:outline-none outline-none font-semibold`} 
                    onClick={history.goBack}
                >
                    ↩️ {t("back")}
                </button>
            }

            <Link className={`w-1/3 h-full flex-col justify-center items-center ${inOtherMenu && inSettings ? 'flex' : 'hidden'}`} to="/">
                🏠 {t("home")}
            </Link>

            <button 
                className="w-1/3 h-full focus:outline-none outline-none"
                onClick={e => toggleTheme()}
                type="button">
                <span>{themeIcon}</span>
            </button>

        </div>
    </div>
}


export default Header