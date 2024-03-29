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

export default function WelcomeDialog(props: {
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
                    Welcome to DUWallet!
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        DUWallet is a (currently experimental) universal cryptocurrency 
                        wallet, supporting many different token/coin types (including but not limited to BTC, ETH, SOL, ...)
                    </Typography>
                    <Typography gutterBottom>
                        This wallet program is created by BadAimWeeb and 
                        is <a href="https://github.com/BadAimWeeb/duwallet" target="_blank" rel="noreferrer">open-source</a>.<br />
                        If you find this useful, consider donating to the creator (at UD domain badaimweeb.888) 💖
                    </Typography>
                    <Typography gutterBottom>
                        It looks like this is the first time you are using DUWallet.
                        Do you want to start with a new wallet or restore an existing one?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose("RESTORE")}>
                        Restore
                    </Button>
                    <Button onClick={() => handleClose("NEW")}>
                        New wallet
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}