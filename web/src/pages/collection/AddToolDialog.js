import React from 'React';

import Styles from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'

const useStyles = Styles.makeStyles({

});

function AddToolDialog(props) {
    const classes = useStyles();

    return (
        <Dialog aria-labelledby="add-tool" open={props.open} onClose={props.onClose}>
            <DialogTitle>Add a new tool</DialogTitle>
        </Dialog>
    )
}