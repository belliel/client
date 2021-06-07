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

	useEffect(() => {
		const unlisten = history.listen((location, action) => {
            setInSettings(location.pathname.toLowerCase() !== "/settings")
		})
        setInSettings(history.location.pathname.toLowerCase() !== "/settings")
	  
		return () => {
			unlisten()
		}
	}, [])

    return <div className="h-16">
        <div className="rounded shadow dark:bg-gray-700 dark:text-gray-200 bg-blue-400 text-white font-semibold h-full flex flex-row justify-between items-center px-4">
            {
                inSettings ? <Link to="/settings">
                    ⚙️ {t("settings")}
                </Link> : <Link to="/">
                    ↩️ {t("main_menu")}
                </Link>
            }
            <button 
                className="focus:outline-none outline-none"
                onClick={e => toggleTheme()}
                type="button">
                <span>{themeIcon}</span>
            </button>
        </div>
    </div>
}


export default Header