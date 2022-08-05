import { useState, useEffect } from 'react';

import { CssBaseline } from "@mui/material";

// Implementing Material UI's dark mode
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function App() {
    let [isDarkMode, setIsDarkMode] = useState(
        // Detect if system-wide dark theme is enabled
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    );
    let [theme, setTheme] = useState(createTheme({
        palette: {
            mode: isDarkMode ? "dark" : "light"
        }
    }));

    // Regenerate theme when isDarkMode changed
    useEffect(() => {
        setTheme(createTheme({
            palette: {
                mode: isDarkMode ? "dark" : "light"
            }
        }));
    }, [isDarkMode]);

    // Detect if system-wide dark theme is changed, and reflect that in isDarkMode
    useEffect(() => {
        let mediaQueryList = globalThis.matchMedia("(prefers-color-scheme: dark)");
        mediaQueryList.addEventListener("change", () => {
            setIsDarkMode(mediaQueryList.matches);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
        </ThemeProvider>
    );
}
