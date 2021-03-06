import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import BorrowInfo from './BorrowInfo';
import BorrowHistory from './BorrowHistory';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

function History() {
    /* Styling */
    const classes = useStyles();

    /* State */
    const [refresh, setRefresh] = React.useState(0);

    return (
        <div className={classes.root}>
            <BorrowInfo />
            <BorrowHistory refresh={refresh} setRefresh={setRefresh}/>
        </div>
    )
}

export default History;