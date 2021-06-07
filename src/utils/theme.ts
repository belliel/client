import { themes, body } from "../hooks/ThemeContext";

export const getUserOSDarkModePreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const doTheme = (theme?: string) => {
    if (theme === undefined) {
        theme = localStorage.getItem("theme") || undefined
        if (theme === undefined)
            theme = getUserOSDarkModePreference() ? themes.dark : themes.light
    }
    console.log(theme)
    localStorage.setItem("theme", theme || "dark")

    if (theme === themes.dark) 
        body.classList.add(themes.dark)
    else
        body.classList.remove(themes.dark)
}

export const getTheme = (): themes => {
    let theme = localStorage.getItem("theme") || undefined
    if (theme === undefined)
        theme = getUserOSDarkModePreference() ? themes.dark : themes.light
    else
        theme = theme === themes.dark ? themes.light : themes.dark
    
    return theme === themes.dark ? themes.light : themes.dark
}

export const toggleTheme = () => {
    let theme = localStorage.getItem("theme") || undefined
    if (theme === undefined)
        theme = getUserOSDarkModePreference() ? themes.dark : themes.light
    else
        theme = theme === themes.dark ? themes.light : themes.dark
    
    if (theme === themes.dark) 
        body.classList.add(themes.dark)
    else
        body.classList.remove(themes.dark)

    localStorage.setItem("theme", theme as themes)
}