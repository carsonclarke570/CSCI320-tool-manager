import React, {useEffect} from 'react';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { KeyboardDatePicker} from '@material-ui/pickers';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
};

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

    /* Categories as DB objects (retrieved from API) */
    const [cats, setCats] = React.useState([]);

    const [selected, setSelected] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };

    const handleChangeSingle = (e) => {
        setSelected(e.target.value);
    };

    useEffect(() => {
        fetch(`http://localhost:5000/categories/`)
            .then(res => res.json())
            .then((result) => {
                setLoaded(true);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setCats(result.content);
                }
            }, (error) => {
                setLoaded(true);
                setError(error);
            });
    }, []);

    const handleAddItem = (e) => {
        e.preventDefault();
        form["user_id"] = process.env.REACT_APP_USER_ID;
        fetch(`http://localhost:5000/tools/`, {
            method: 'post',
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => res.json())
        .then((result) => {
            selected.map(e => {
                fetch(`http://localhost:5000/falls_under/`, {
                    method: 'post',
                    body: JSON.stringify({
                        "category_id": e.id,
                        "tool_id": result.content.id,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            });
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
                            <FormControl className={classes.formControl} fullWidth={true}>
                                <InputLabel id="mutiple-chip-label">Categories</InputLabel>
                                <Select 
                                    multiple 
                                    value={selected} 
                                    onChange={handleChangeSingle} 
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected) => (
                                        <div className={classes.chips}>
                                            {selected.map((c) => (
                                                <Chip key={c.name} label={c.name} className={classes.chip} />
                                            ))}
                                        </div>
                                    )}
                                >
                                    {cats.map((c) => (
                                        <MenuItem key={c.name} value={c}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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