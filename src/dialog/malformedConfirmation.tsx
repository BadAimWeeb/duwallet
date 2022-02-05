import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CLogic from '../CLogic';

function exportData() {
    let ae = document.createElement("a");
    ae.download = "duwallet-corrupted-wallet.txt";

    let b = new Blob([localStorage.getItem("duwallet") ?? ""]);
    ae.href = URL.createObjectURL(b);
    ae.click();
}

export default function MalformedConfirmationDialog() {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        let clogic: CLogic = (globalThis as any).cLogic as CLogic;
        
        clogic.voidData();
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Corrupted wallet data
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We could not decode/decrypt your wallet data, as it might have been corrupted.<br />
                        You might want to export your wallet data for recovery.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={exportData}>Export data</Button>
                    <Button color="error" onClick={handleClose} autoFocus>
                        CLEAR AND SETUP AS NEW
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}