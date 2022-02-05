import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ClearConfirmationDialog(props: {
    cb: Function
}) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (clear: boolean) => {
        props.cb(clear);
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
                    Confirm clearing all data?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        THIS ACTION IS IRREVERSIBLE!<br />
                        You will no longer be able to access this wallet unless you have a backup (that you can decrypt).
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)}>GO BACK</Button>
                    <Button color="error" onClick={() => handleClose(true)} autoFocus>
                        CLEAR
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}