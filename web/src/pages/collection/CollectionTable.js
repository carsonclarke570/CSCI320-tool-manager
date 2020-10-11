import React, {
    useEffect,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { DataTableHead, DataTableToolbar } from '../../components/Table';
import { Table, TableBody, TableContainer, TableRow, TableCell, TablePagination } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        borderRadius: '0px',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750,
    }
}));

const header = [
    {id: "name", numeric: false, paddingOff: false, label: "Tool Name"},
    {id: "barcode", numeric: false, paddingOff: false, label: "Barcode"},
    {id: "purchase_date", numeric: false, paddingOff: false, label: "Purchased On"},
    {id: "lendable", numeric: true, paddingOff: false, label: "Available to Lend"},
];

function CollectionTable() {
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

    useEffect(() => {
        fetch(`http://localhost:5000/tools?user_id=${process.env.REACT_APP_USER_ID}&order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}&removed_date=null`)
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
    }, [orderBy, order, page, rowsPerPage]);

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
            <DataTableToolbar title="Collection" />
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} header={header}/>
                    <TableBody>
                        {tools.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow hover tabIndex={-1} key={row.name}>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.barcode}</TableCell>
                                    <TableCell align="left">{row.purchase_date}</TableCell>
                                    <TableCell align="right">{row.lendable ? <DoneIcon /> : <ClearIcon />}</TableCell>
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

export default CollectionTable;