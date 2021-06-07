import { useEffect, useState } from "react"
import { doTheme, getTheme } from "../utils/theme"
import { themeIcons, themes } from "./ThemeContext"


export default function useTheme() {
    const [theme, setTheme] = useState<themes|null>(null)
    const [themeIcon, setThemeIcon] = useState<themeIcons|null>(null)

    const toggleTheme = () => {
        const theme = Object.values(themes).find(t => getTheme() !== t ) || themes.dark
        setTheme(theme)
    }

    useEffect(() => {
        const _ = async () => {
            const t = getTheme()
            setThemeIcon(themeIcons[t])
            setTheme(t)
        }
        _()
    }, [])

    useEffect(() => {
        setThemeIcon(themeIcons[theme || themes.dark])
        doTheme(theme || themes.dark)
    }, [theme])

    return {
        theme,
        themeIcon,
        setTheme,
        toggleTheme
    }
}