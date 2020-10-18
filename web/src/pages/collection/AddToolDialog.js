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

function AddToolDialog(props) {
    const classes = useStyles();

    const [form, setForm] = React.useState({
        "purchase_date": new moment().format(),
        "lendable": false
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        form["user_id"] = process.env.REACT_APP_USER_ID;
        fetch(`http://localhost:5000/tools/`, {
            method: 'post',
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(() => {
            console.log(form);
            props.setRefresh(props.refresh + 1);
        });
        props.onClose();
    };

    return (
        <Dialog className={classes.root} aria-labelledby="add-tool" open={props.open} onClose={props.onClose}>
            <DialogTitle>Add A New Tool</DialogTitle>
            <form onSubmit={handleAddItem}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField className={classes.element} onChange={handleChange} required id="name" label="Name" fullWidth={true} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField className={classes.element} onChange={handleChange} required id="barcode" label="Barcode" fullWidth={true} />
                        </Grid>
                        <Grid item xs={6}>
                            <KeyboardDatePicker
                                required
                                className={classes.element}
                                disableToolbar
                                format="MM/DD/yyyy"
                                id="purchase_date"
                                label="Purchase Date"
                                value={form["purchase_date"]}
                                onChange={(date) => {setForm({...form, ["purchase_date"]: date.format()})}}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={form["lendable"]} onChange={(e) => {setForm({...form, "lendable": e.target.checked})}} />}
                                label="Can this tool be borrowed?"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Add Tool
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddToolDialog;