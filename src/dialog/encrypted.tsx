import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function FormDialog(props: {
    callback?: Function
}) {
    const [open, setOpen] = React.useState<boolean>(true);
    const [passphrase, setPassphrase] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    const handleOpen = (s?: string) => {
        if (s) {
            setError(s);
        } else {
            setError("");
        }
        setOpen(true);
    };

    const handleClose = (data: boolean | string) => {
        setOpen(false);
        props.callback?.(data, handleOpen);
    };

    return (
        <div>
            <Dialog open={open} onClose={() => true} disableEscapeKeyDown>
                <DialogTitle>Vault is encrypted.</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your passphrase to unlock this vault.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="encrypted_passphrase"
                        label="Passphrase"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={e => setPassphrase(e.target.value)}
                    />
                    <Typography color="#F00">{error}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={() => handleClose(false)}>CLEAR AND SETUP AS NEW</Button>
                    <Button onClick={() => handleClose(passphrase)}>Unlock</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}