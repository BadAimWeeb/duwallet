import React from "react";
import { Paper, Button, Typography, Grid } from "@mui/material";

import CLogic from "../CLogic";

import "./IOData.css";

export default function IOData(props: {
    cLogic: CLogic,
    dark: boolean
}) {
    return (
        <React.Fragment>
            <Paper elevation={2} className="iodata-l1">
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Paper elevation={4} className="iodata-l1">
                            <Typography gutterBottom>
                                <b style={{ fontSize: 14 }}>PASSPHRASE CHANGING</b>
                            </Typography>
                            <Button variant={props.dark ? "outlined" : "contained"}>Change passphrase</Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Paper elevation={4} className="iodata-l1">
                            <Button variant={props.dark ? "outlined" : "contained"}>Import data</Button>
                            <Button variant={props.dark ? "outlined" : "contained"} color="warning">Export data (un-encrypted)</Button>
                            <Button variant={props.dark ? "outlined" : "contained"} color="warning">Export data (re-encrypted)</Button>
                            <Button variant={props.dark ? "outlined" : "contained"} color="success">Export data (original)</Button>
                            <Button variant={props.dark ? "outlined" : "contained"} color="error">Clear all wallet data</Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    );
}