
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



export default function ({ open, title, description, onConfirm, onCancel, cancelLabel = 'cancel', confirmLabel = 'confirm' }) {


    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                '& .MuiPaper-root': {
                    paddingBlock: 3,
                    paddingInline: 2,
                    borderRadius: 5,
                },
            }}
        >
            <DialogTitle id="alert-dialog-title" >
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onCancel}
                    sx={{
                        backgroundColor: 'grey.300',
                        color: 'black',
                        ':hover': {
                            backgroundColor: 'grey.400',
                        },
                        borderRadius: 2,
                        boxShadow: 2,
                        textTransform: 'none',
                        px: 3,
                    }}
                >
                    {cancelLabel}
                </Button>
                <Button
                    onClick={onConfirm}
                    sx={{
                        backgroundColor: '#2c2c2c',
                        color: 'white',
                        ':hover': {
                            backgroundColor: '#1c1c1c',
                        },
                        borderRadius: 2,
                        boxShadow: 2,
                        textTransform: 'none',
                        px: 3,
                    }}
                    autoFocus
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}