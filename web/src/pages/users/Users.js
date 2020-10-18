import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import UserTable from './UserTable';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

function Users() {
    const classes = useStyles();
    const [refresh, setRefresh] = React.useState(0)

    return (
        <div className={classes.root}>
            <UserTable refresh={refresh} setRefresh={setRefresh}/>
        </div>
    )
}

export default Users;