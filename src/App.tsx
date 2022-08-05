import { useState, useEffect } from 'react';

// Routing
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

// Material UI's dark mode
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI components
import { Container, Typography } from "@mui/material";

// Import header and pages
import Header from "./Header";

// Import dialog
import WelcomeDialog from "./Dialog/Welcome";
import NewWalletDialog from "./Dialog/NewWallet";

// Import generic dialog
import YesNoDialog from "./Dialog/YesNo";

// Import API
import API from "./API/index";

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

    let [dialog, setDialog] = useState(<div />);

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

    function openDialog(Dialog: React.FunctionComponent<{
        callback: (result: string) => void;
    }>) {
        let pResolve: (x: string) => void, promise = new Promise<string>((resolve) => {
            pResolve = resolve;
        });

        setDialog(<Dialog callback={(result) => {
            pResolve(result);
            setDialog(<div />);
        }} />);
        return promise;
    }

    function openYesNoDialog(title: string, message: JSX.Element) {
        let pResolve: (x: string) => void, promise = new Promise<string>((resolve) => {
            pResolve = resolve;
        });

        setDialog(<YesNoDialog callback={(result) => {
            pResolve(result);
            setDialog(<div />);
        }} title={title} message={message} />);
        return promise;
    }

    // Main code
    useEffect(() => {
        (async () => {
            // Attempt to load data
            let result = API.loadData();

            switch (result) {
                case "NEW":
                    {
                        let resultWelcome = await openDialog(WelcomeDialog);
                        switch (result) {
                            case "NEW":
                                for (; ;) {
                                    let result = await openDialog(NewWalletDialog);
                                    switch (result) {
                                        case "UNENCRYPTED":
                                            let confirmation = await openYesNoDialog(
                                                "Are you sure?",
                                                <Typography gutterBottom>
                                                    Your wallet will NOT be encrypted and anyone that has access to wallet data can spend your funds.<br />
                                                    You should only do this if you know what you are doing.
                                                </Typography>
                                            );
                                            if (confirmation == "YES") {
                                                break;
                                            } else continue;
                                    }
                                }
                        }
                    }
                    break;
            }
        })();
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
