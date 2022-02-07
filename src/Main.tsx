import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import Header from "./Header";

// Dialog
import DialogEncrypted from "./dialog/encrypted";
import DialogClearConfirmation from "./dialog/clearConfirmation";
import DialogMalformedConfirmation from "./dialog/malformedConfirmation";
import DialogNewData from "./dialog/newData";

// Pages
import PageIOData from "./pages/IOData";

import CLogic from "./CLogic";
import React from "react";

// Implementing Material UI's dark mode
import { Container, Box, CssBaseline } from "@mui/material";
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles'

let cLogicInstance = new CLogic();

export default class Main extends React.Component {
    state: {
        extDOM: JSX.Element | null,
        theme: Theme,
        dark: boolean
    } = {
            extDOM: null,
            theme: createTheme(),
            dark: false
        }

    constructor(props: {}) {
        super(props);

        let mdark = window.matchMedia("(prefers-color-scheme: dark)");
        this.state.theme = createTheme({
            palette: {
                mode: mdark.matches ? "dark" : "light"
            }
        });
        this.state.dark = mdark.matches;

        mdark.addEventListener("change", e => {
            this.setState({
                ...this.state,
                theme: createTheme({
                    palette: {
                        mode: e.matches ? "dark" : "light"
                    }
                }),
                dark: e.matches
            });
        });
    }

    componentDidMount() {
        this.reload();
    }

    setExtDOM(v: JSX.Element | null) {
        this.setState({
            ...this.state,
            extDOM: v
        })
    }

    reload() {
        let setExtDOM = this.setExtDOM.bind(this);

        let readStatus = cLogicInstance.readData();
        switch (readStatus) {
            case "ENCRYPTED":
                let d = <DialogEncrypted callback={(cbData: string | boolean, cf: Function) => {
                    if (typeof cbData === "boolean") {
                        setExtDOM(<DialogClearConfirmation cb={(confirm: boolean) => {
                            if (!confirm) {
                                setExtDOM(d);
                                cf();
                            } else {
                                cLogicInstance.voidData();
                                this.reload();
                            }
                        }} />);
                    } else {
                        // Attempting to decrypt
                        readStatus = cLogicInstance.readData(cbData);
                        switch (readStatus) {
                            case "OK":
                                setTimeout(() => setExtDOM(null), 500);
                                break;
                            case "MALFORMED":
                                setExtDOM(
                                    <DialogMalformedConfirmation cLogic={cLogicInstance} />
                                )
                                break;
                            case "DECFAULT":
                                setExtDOM(d);
                                cf("The passphrase you entered is not valid.");
                                break;
                            case "ENCRYPTED":
                                setExtDOM(d);
                                cf("Please enter passphrase.");
                                break;
                            default:
                                setExtDOM(d);
                                cf("Something went wrong: CLogic returned " + readStatus);
                        }
                    }
                }} />;

                setExtDOM(d)
                break;
            case "MALFORMED":
                setExtDOM(
                    <DialogMalformedConfirmation cLogic={cLogicInstance} />
                )
                break;
            case "NEW":
                setExtDOM(
                    <DialogNewData cLogic={cLogicInstance} />
                )
                break;
        }
    }

    render() {
        return (
            <ThemeProvider theme={this.state.theme}>
                <CssBaseline enableColorScheme />
                <Router>
                    <Header />
                    {this.state.extDOM}
                    <Container style={{
                        marginTop: 24
                    }}>
                        <Routes>
                            <Route path="/iodata" element={<PageIOData dark={this.state.dark} cLogic={cLogicInstance} />} />
                        </Routes>
                    </Container>
                </Router>
            </ThemeProvider>
        )
    }
}
