import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default function NewWalletDialog(props: {
    callback: (result: string) => void;
}) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (result: string) => {
        setOpen(false);
        props.callback(result);
    };

    return (
        <div>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title">
                    New Wallet
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Do you want to allow other users without your passphrase to view your balance?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => handleClose("UNENCRYPTED")}>
                        Unencrypted
                    </Button>
                    <div style={{flex: '1 0 0'}} />
                    <Button onClick={() => handleClose("ENCRYPT_KEY")}>
                        Yes
                    </Button>
                    <Button autoFocus onClick={() => handleClose("ENCRYPT_FULL")}>
                        No
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}