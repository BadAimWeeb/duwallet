import { useState, useEffect } from 'react';

// Routing
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

// Material UI's dark mode
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI components
import { Container } from "@mui/material";

// Import header and pages
import Header from "./Header";

// Import dialog
import WelcomeDialog from "./Dialog/Welcome";

export default function App() {
    let [isDarkMode, setIsDarkMode] = useState(
        // Detect if system-wide dark theme is enabled
        matchMedia("(prefers-color-scheme: dark)").matches
    );
    let [theme, setTheme] = useState(createTheme({
        palette: {
            mode: isDarkMode ? "dark" : "light"
        }
    }));

    let [dialog, setDialog] = useState(<WelcomeDialog />);

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
        let mediaQueryList = matchMedia("(prefers-color-scheme: dark)");
        mediaQueryList.addEventListener("change", () => {
            setIsDarkMode(mediaQueryList.matches);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />

            <Router>
                <Header />
                <Container style={{
                    marginTop: 24
                }}>
                    <Routes>

                    </Routes>
                </Container>
                {dialog}
            </Router>
        </ThemeProvider>
    );
}
