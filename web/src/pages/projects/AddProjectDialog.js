import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "left"
    },
    grid: {

    },
    element: {

    }
}));

function AddProjectDialog(props) {
    const classes = useStyles();
    
    const [name, setName] = React.useState("");

    const handleReturn = (e) => {
       e.preventDefault();
        fetch("http://localhost:5000/projects/", {
            method: 'post',
            body: JSON.stringify({
                "user_id": process.env.REACT_APP_USER_ID,
                "name": name,
                "completed": false
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
            <DialogTitle>Add A New Project</DialogTitle>
            <form onSubmit={handleReturn}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField className={classes.element} onChange={(e) => setName(e.target.value)} required id="name" label="Project Name" fullWidth={true} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.onClose()} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Add Project
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddProjectDialog;