import React, {
    useEffect,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';

import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import { DataTableHead, DataTableToolbar } from '../../components/Table';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '0px',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750,
    }
}));

const header = [
    {id: "first_name", numeric: false, paddingOff: false, label: "First Name"},
    {id: "last_name", numeric: false, paddingOff: false, label: "Last Name"},
    {id: null, numeric: true, paddingOff: false, label: "Collection"},
];

function UserTable(props) {
    const classes = useStyles();

    /* Load API Data */
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [total, setTotal] = React.useState(0);

    /* Table Control */
    const [orderBy, setOrderBy] = React.useState('first_name');
    const [page, setPage] = React.useState(1);
    const [order, setOrder] = React.useState("asc");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
        fetch(`http://localhost:5000/users/?order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}`)
            .then(res => res.json())
            .then((result) => {
                setIsLoaded(true);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setUsers(result.content);
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
                <DataTableToolbar title="Removed Tools" />
                <div>Error: {error.message}</div>;
            </Paper>
        );
    }

    if (!isLoaded) {
        return (
            <Paper className={classes.root}>
                <DataTableToolbar title="Removed Tools" />
                <div>Loading...</div>
            </Paper>
        );
    }

    return (
        <Paper className={classes.root}>
            <DataTableToolbar title="Users" />
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} header={header}/>
                    <TableBody>
                        {users.map((row, index) => {
                            const link = `/users/${row.id}/collection/`;
                            const key = `${row.name}-${row.id}`

                            return (
                                <TableRow hover tabIndex={-1} key={key}>
                                    <TableCell align="left">{row.first_name}</TableCell>
                                    <TableCell align="left">{row.last_name}</TableCell>
                                    <TableCell align="right">
                                        <IconButton href={link}>
                                            <LibraryBooksIcon color="inherit" />
                                        </IconButton>
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

export default UserTable;