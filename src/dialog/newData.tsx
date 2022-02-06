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

import CLogic from "../CLogic";

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
    onClose: () => void;
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

export default function NewDataDialog(props: {
    cLogic: CLogic
}) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (noshow?: boolean) => {
        setOpen(false);
        if (noshow) {
            props.cLogic.setData({});
        }
    };

    return (
        <div>
            <BootstrapDialog
                onClose={() => handleClose()}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => handleClose()}>
                    Welcome to DUWallet!
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        DUWallet is a (currently experimental) universal cryptocurrency 
                        wallet, designed to work with many types of cryptocurrency.
                    </Typography>
                    <Typography gutterBottom>
                        This wallet program is created by BadAimWeeb and 
                        is <a href="https://github.com/BadAimWeeb/duwallet" target="_blank" rel="noreferrer">open-source</a>.<br />
                        If you find this useful, consider donating to the creator 💖 <br />(at UD domain badaimweeb.888)
                    </Typography>
                    <Typography gutterBottom>
                        This message will never be shown again when you add/modify wallet data. 
                        Alternatively, you can press "Don't show this again" to initialize a blank wallet 
                        (which will cause this message to not appear again).
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleClose(true)}>
                        OK, don't show this again
                    </Button>
                    <Button autoFocus onClick={() => handleClose()}>
                        OK!
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}