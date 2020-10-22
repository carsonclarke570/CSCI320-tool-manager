import React, {useEffect} from 'react';
import { useParams } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import PersonIcon from '@material-ui/icons/Person';
import BuildIcon from '@material-ui/icons/Build';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '0px',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

function BorrowInfo(props) {
    /* Styling */
    const classes = useStyles();

    /* Path Params */
    const {id} = useParams();

    /* State */
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    const [user, setUser] = React.useState({});
    const [tool, setTool] = React.useState({});
    const [history, setHistory] = React.useState([]);

    /* Effects */
    useEffect(() => {

        // Fetch tool
        fetch(`http://localhost:5000/tools/${id}/`)
            .then(res => res.json())
            .then((result) => {
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setTool(result.content);
                    fetch(`http://localhost:5000/users/${result.content.user_id}`)
                        .then(res => res.json())
                        .then((result) => {
                            setIsLoaded(true);
                            if (result.code !== 200) {
                                setError(result.content);
                            } else {
                                setUser(result.content);
                            }
                        }, (error) => {
                            setIsLoaded(true);
                            setError(error);
                        });
                }
            }, (error) => {
                setIsLoaded(true);
                setError(error);
            });

        // Fetch his
        fetch(`http://localhost:5000/borrows/history/${id}`)
            .then(res => res.json())
            .then((result) => {
                setLoaded(true);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setHistory(result.content);
                }
            }, (error) => {
                setLoaded(true);
                setError(error);
            });
    }, [props.refresh]);

    if (error) {
        return (
            <div>Error: {error.message}</div>
        );
    }

    if (!isLoaded || !loaded) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <Paper className={classes.root}> 
            <Typography variant="h6">Tool Info</Typography>
            <List>
                {/* Tool */}
                <ListItem>
                    <ListItemAvatar>
                        <BuildIcon />
                    </ListItemAvatar>
                    <ListItemText primary="Tool Name" secondary={tool.name} />
                </ListItem>
                {/* Owner */}
                <ListItem>
                    <ListItemAvatar>
                        <PersonIcon />
                    </ListItemAvatar>
                    <ListItemText primary="Owner" secondary={user.first_name + " " + user.last_name} />
                </ListItem>
                {/* Status */}
                <ListItem>
                    <ListItemText primary="On Lend To:" secondary={tool.lendable ? (
                        history.current_user ? (
                            <Typography variant="subtitle2" color="secondary">{history.current_user.first_name} {history.current_user.last_name}</Typography>
                        ) : (
                            <Typography variant="subtitle2" color="primary">Available To Lend</Typography>
                        )
                    ) : (
                        <Typography variant="subtitle2" color="error">Not Available To Lend</Typography>
                    )} />
                </ListItem>
            </List>
        </Paper>
    )
}

export default BorrowInfo;