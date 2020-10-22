import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ProjectList from './ProjectList';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

function Projects() {
    const classes = useStyles();
    const [refresh, setRefresh] = React.useState(0)

    return (
        <div className={classes.root}>
            <ProjectList refresh={refresh} setRefresh={setRefresh}/>
        </div>
    )
}

export default Projects;