import React from "react";
import { AppBar, Toolbar, Typography, Button, Alert } from "@mui/material";
import { AccountBalanceWalletSharp } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const headersData = [
    {
        label: "Balances",
        href: "/wallet",
    },
    {
        label: "Send",
        href: "/send",
    },
    {
        label: "Import/Export",
        href: "/iodata",
    }
];

const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
        return (
            <Button
                {...{
                    key: label,
                    color: "inherit",
                    to: href,
                    component: RouterLink,
                    style: {
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 700,
                        size: "18px",
                        marginLeft: "38px",
                    }
                }}
            >
                {label}
            </Button>
        );
    });
};

let logo = (
    <div style={{ display: "flex", alignItems: "center" }}>
        <AccountBalanceWalletSharp />
        <Typography variant="h6" component="h1" style={{ paddingLeft: 4 }}>
            DUWallet
        </Typography>
    </div>
);

class ActualHeader extends React.Component {
    render() {
        return (
            <Toolbar style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                {logo}
                <div>{getMenuButtons()}</div>
            </Toolbar>
        );
    }
}

export default function Header() {
    let [etw, setEtw] = React.useState<boolean>(true);

    let expTechWarn = (
        <Alert variant="filled" severity="warning" onClose={() => setEtw(false)}>
            EXPERIMENTAL! You should not use this in production enviroments.
        </Alert>
    );

    return (
        <header>
            <AppBar>
                <ActualHeader />
                {etw ? expTechWarn : null}
            </AppBar>
        </header>
    );
}