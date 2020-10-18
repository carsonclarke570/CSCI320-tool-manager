import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import UserCollectionTable from './UserColectionTable';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

function UserCollection() {
    /* Styling */
    const classes = useStyles();

    /* State */
    const [refresh, setRefresh] = React.useState(0);

    return (
        <div className={classes.root}>
            <UserCollectionTable refresh={refresh} setRefresh={setRefresh}/>
        </div>
    )
}

export default UserCollection;