import React, {
    useEffect,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { DataTableHead, DataTableToolbar } from '../../components/Table';
import { Table, TableBody, TableContainer, TableRow, TableCell, TablePagination, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

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
    {id: "name", numeric: false, paddingOff: false, label: "Tool Name"},
    {id: 'status', numeric: false, paddingOff: false, label: "Status"},
    {id: null, numeric: false, paddingOff: false, label: "Borrowed On"},
    {id: null, numeric: false, paddingOff: false, label: "Return By"},
    {id: "barcode", numeric: false, paddingOff: false, label: "Barcode"},
    {id: "purchase_date", numeric: false, paddingOff: false, label: "Purchased On"},
    {id: null, numeric: true, paddingOff: false, label: "Return"},
];

function BorrowedTable(props) {
    const classes = useStyles();

    /* Load API Data */
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [tools, setTools] = React.useState([]);
    const [total, setTotal] = React.useState(0);

    /* Table Control */
    const [orderBy, setOrderBy] = React.useState('name');
    const [page, setPage] = React.useState(1);
    const [order, setOrder] = React.useState("asc");
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

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

    const handleReturn = (id) => (event) => {
        fetch(`http://localhost:5000/borrows/return/${id}`, {
            method: 'post'
        }).then(() => {
            props.setRefresh(props.refresh + 1);
        })
    };

    useEffect(() => {
        fetch(`http://localhost:5000/borrows/user/${process.env.REACT_APP_USER_ID}?order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}`)
            .then(res => res.json())
            .then((result) => {
                setIsLoaded(true);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setTools(result.content);
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
            <DataTableToolbar title="Borrowed Tools" />
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} header={header}/>
                    <TableBody>
                        {tools.map((row, index) => {
                            return (
                                <TableRow hover tabIndex={-1} key={row.name}>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{
                                        row.days_late ? (
                                            row.days_late < 0 ? (
                                                <Typography variant="inherit" color="primary">{-row.days_late} Day(s) Left</Typography>
                                            ) : (
                                                <Typography variant="inherit" color="error">{row.days_late} Day(s) Overdue</Typography>
                                            )
                                        ) : (<Typography variant="inherit" color="secondary">Due Today</Typography>)
                                    }</TableCell>
                                    <TableCell align="left">{row.borrowed_on}</TableCell>
                                    <TableCell align="left">{row.return_date}</TableCell>
                                    <TableCell align="left">{row.barcode}</TableCell>
                                    <TableCell align="left">{row.purchase_date}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={handleReturn(row.id)}>
                                            <KeyboardReturnIcon color="secondary" />
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

export default BorrowedTable;