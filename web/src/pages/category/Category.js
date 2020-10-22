import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CategoryList from './CategoryList';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

function Category() {

    /* Styling */
    const classes = useStyles();

    /* State */
    const [refresh, setRefresh] = React.useState(0);

    return (
        <div className={classes.root}>
            <CategoryList refresh={refresh} setRefresh={setRefresh} />
        </div>
    )
}

export default Category;