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
import PromptInputDialog from "./Dialog/PromptInput";
import InfoDialog from "./Dialog/Info";

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

    function openPromptInputDialog(title: string, message: JSX.Element, type: string, promptLabel: string) {
        let pResolve: (x: string) => void, promise = new Promise<string>((resolve) => {
            pResolve = resolve;
        });

        setDialog(<PromptInputDialog callback={(result) => {
            pResolve(result);
            setDialog(<div />);
        }} title={title} message={message} type={type} promptLabel={promptLabel} />);
        return promise;
    }

    function openInfoDialog(title: string, message: JSX.Element) {
        let pResolve: (x: string) => void, promise = new Promise<string>((resolve) => {
            pResolve = resolve;
        });

        setDialog(<InfoDialog callback={(result) => {
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
                                    if (result === "UNENCRYPTED") {
                                        let confirmation = await openYesNoDialog(
                                            "Are you sure?",
                                            <Typography gutterBottom>
                                                Your wallet will NOT be encrypted and anyone that has access to wallet data can spend your funds.<br />
                                                You should only do this if you know what you are doing.
                                            </Typography>
                                        );
                                        if (confirmation == "YES") {
                                            API.createUnencryptedWallet();
                                            break;
                                        } else continue;
                                    } else if (result === "ENCRYPT_KEY" || result === "ENCRYPT_FULL") {
                                        let passphrase = await openPromptInputDialog(
                                            "Enter passphrase",
                                            <Typography gutterBottom>
                                                Enter a passphrase that will be used to encrypt your wallet.<br />
                                                This passphrase will be used to decrypt your wallet when you want to spend your funds.<br />
                                                Leave empty to go back to the previous screen.
                                            </Typography>,
                                            "password",
                                            "Passphrase"
                                        );
                                        if (passphrase == "") continue;
                                        // Confirm password
                                        let passphraseConfirm = await openPromptInputDialog(
                                            "Confirm passphrase",
                                            <Typography gutterBottom>
                                                Enter the passphrase again to confirm.
                                            </Typography>,
                                            "password",
                                            "Passphrase"
                                        );
                                        if (passphrase !== passphraseConfirm) {
                                            await openInfoDialog(
                                                "Passphrase mismatch",
                                                <Typography gutterBottom>
                                                    The passphrases you entered do not match.
                                                </Typography>
                                            );
                                            continue;
                                        } else {
                                            result === "ENCRYPT_KEY" ?
                                                API.createHalfEncryptedWallet(passphrase) :
                                                API.createEncryptedWallet(passphrase);
                                            break;
                                        }
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
