import React, {
    useEffect,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CollectionTable from './CollectionTable';
import BorrowedTable from './BorrowedTable';
import RemovedTable from './RemovedTable';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

function Collection() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CollectionTable />
            <BorrowedTable />
            <RemovedTable />
        </div>
    )
}

export default Collection;