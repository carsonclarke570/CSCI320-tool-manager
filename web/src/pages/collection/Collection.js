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
    const [refresh, setRefresh] = React.useState(0)

    return (
        <div className={classes.root}>
            <CollectionTable refresh={refresh} setRefresh={setRefresh}/>
            <BorrowedTable refresh={refresh} setRefresh={setRefresh}/>
            <RemovedTable refresh={refresh} setRefresh={setRefresh}/>
        </div>
    )
}

export default Collection;