import { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export enum themes {
    dark = "dark",
    light = "light",
}

export enum themeIcons {
    dark = "🌙",
    light = "😎",
}

export const body = document.documentElement

export const ThemeContext = createContext<{
    theme: themes | null;
    themeIcon: themeIcons | null,
    setTheme: Dispatch<SetStateAction<themes | null>>;
    toggleTheme: () => void,
}>({
    theme: null,
    themeIcon: null,
    setTheme: () => { },
    toggleTheme: () => { },
});