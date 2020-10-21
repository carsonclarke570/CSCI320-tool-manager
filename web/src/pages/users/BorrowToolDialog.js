import React from 'react';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { KeyboardDatePicker} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "left"
    },
    grid: {

    },
    element: {

    }
}));

function BorrowToolDialog(props) {
    const classes = useStyles();
    let { tool_id } = props;
    
    const [returnDate, setReturnDate] = React.useState(new moment().format());

    const handleReturn = (e) => {
        console.log(tool_id);
        fetch(`http://localhost:5000/borrows/`, {
            method: 'post',
            body: JSON.stringify({
                "tool_id": tool_id,
                "user_id": process.env.REACT_APP_USER_ID,
                "borrowed_on": new Date(),
                "return_date": returnDate
            }),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(() => {
            props.setRefresh(props.refresh + 1);
        })
        props.onClose();
    };

    return (
        <Dialog className={classes.root} aria-labelledby="add-tool" open={props.open} onClose={props.onClose}>
            <DialogTitle>Choose A Return Date</DialogTitle>
            <form onSubmit={handleReturn}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <KeyboardDatePicker
                                required
                                className={classes.element}
                                disableToolbar
                                format="MM/DD/yyyy"
                                id="return_date"
                                label=""
                                value={returnDate}
                                onChange={(date) => {setReturnDate(date)}}
                                fullWidth={true}
                                disablePast={true}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.onClose()} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Borrow Tool
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default BorrowToolDialog;