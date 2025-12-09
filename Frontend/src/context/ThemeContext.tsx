import {createContext, useState, useLayoutEffect } from "react";
import type { ReactNode } from "react";
type ThemeContextType = {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
    toggleTheme: () => void;
}

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
export const ThemeProvider = ({children}: ThemeProviderProps)=>{
    const initialTheme = (): "light" | "dark" =>{
        const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
    
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
    
        return prefersDark ? "dark" : "light";
    }
    
    const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

    // useLayoutEffect runs synchronously before paint to avoid flashes or lag on toggle
    useLayoutEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const value:ThemeContextType = { theme, setTheme, toggleTheme };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}
