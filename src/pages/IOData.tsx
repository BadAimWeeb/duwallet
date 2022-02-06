import React from "react";
import { Paper } from "@mui/material";

import CLogic from "../CLogic";

export default function IOData(props: {
    cLogic: CLogic
}) {
    return (
        <React.Fragment>
           <Paper elevation={1} style={{ padding: 8 }}>
               <Paper elevation={3} style={{ marginTop: 8, marginBottom: 8, padding: 8 }}>
                    test1
               </Paper>

               <Paper elevation={3} style={{ marginTop: 8, marginBottom: 8, padding: 8 }}>
                   test2
               </Paper>
            </Paper> 
        </React.Fragment>
    );
}