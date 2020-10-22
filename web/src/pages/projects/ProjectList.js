import React, {
    useEffect,
} from 'react';

import { lighten, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { DataTableHead, DataTableToolbar } from '../../components/Table';
import { Table, TableBody, TableContainer, TableRow, TableCell, TablePagination } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import AddProjectDialog from './AddProjectDialog';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '0px',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750,
    },
    chip: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

const header = [
    {id: "name", numeric: false, paddingOff: false, label: "Project Name"},
    {id: "completed", numeric: null, paddingOff: false, label: "Completed?"},
    {id: null, numeric: true, paddingOff: false, label: "Actions"},
];

function ProjectList(props) {
    const classes = useStyles();

    /* Load API Data */
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [projects, setProjects] = React.useState([]);
    const [total, setTotal] = React.useState(0);

    /* Table Control */
    const [orderBy, setOrderBy] = React.useState('name');
    const [page, setPage] = React.useState(1);
    const [order, setOrder] = React.useState("asc");
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

    /* Add Project Dialog */
    const [open, setOpen] = React.useState(false);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    useEffect(() => {
        fetch(`http://localhost:5000/projects/?user_id=${process.env.REACT_APP_USER_ID}&order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}`)
            .then(res => res.json())
            .then((result) => {
                setIsLoaded(true);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setProjects(result.content);
                    setTotal(result.pagination.total);
                }
            }, (error) => {
                setIsLoaded(true);
                setError(error);
            });
    }, [orderBy, order, page, rowsPerPage, props.refresh]);

    if (error) {
        
        return (
            <Paper className={classes.root}>
                <DataTableToolbar title="Collection" />
                <div>Error: {error.message}</div>;
            </Paper>
        );
    }

    if (!isLoaded) {
        return (
            <Paper className={classes.root}>
                <DataTableToolbar title="Collection" />
                <div>Loading...</div>
            </Paper>
        );
    }

    return (
        <Paper className={classes.root}>
            <DataTableToolbar title="My Projects" numSelected={0}>
                <Tooltip title="Add Project">
                    <IconButton onClick={() => {setOpen(true)}} aria-label="Add Tool" color="primary">
                        <AddIcon />
                        <AddProjectDialog open={open} onClose={() => {setOpen(false)}} refresh={props.refresh} setRefresh={props.setRefresh}/>
                    </IconButton>
                </Tooltip>
            </DataTableToolbar>
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} header={header}/>
                    <TableBody>
                        {projects.map((row, index) => {
                            const link = `/history/${row.id}`;
                            const key = `${row.name}${index}`;

                            return (
                                <TableRow hover tabIndex={-1} key={key}>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="center">{
                                        row.completed ? (
                                            <Tooltip title="Completed"><DoneIcon color="primary" /></Tooltip>
                                        ) : (
                                            <Tooltip title="Completed"><ClearIcon color="secondary" /></Tooltip>
                                        )
                                    }</TableCell>
                                    <TableCell align="right">
                                        {!row.completed && ( 
                                            <Tooltip title="Complete">
                                                <IconButton>
                                                    <DoneIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Info">
                                            <IconButton>
                                                <MoreHorizIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination 
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default ProjectList;