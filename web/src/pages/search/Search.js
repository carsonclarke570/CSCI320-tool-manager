import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { DataTableHead, DataTableToolbar } from '../../components/Table';
import BorrowToolDialog from '../users/BorrowToolDialog';

import { Table, TableBody, TableContainer, TableRow, TableCell, TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import HistoryIcon from '@material-ui/icons/History';
import SearchIcon from '@material-ui/icons/Search';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '0px',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    paper: {
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
    {id: "name", numeric: false, paddingOff: false, label: "Tool Name"},
    {id: "barcode", numeric: false, paddingOff: false, label: "Barcode"},
    {id: "purchase_date", numeric: false, paddingOff: false, label: "Purchased On"},
    {id: null, numeric: null, paddingOff: false, label: "Availability"},
    {id: null, numeric: false, paddingOff: false, label: "Categories"},
    {id: null, numeric: true, paddingOff: false, label: "Actions"}
];

function Search() {
    /* Styling */
    const classes = useStyles();

    /* Load API Data */
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [results, setResults] = React.useState([]);
    const [active, setActive] = React.useState(null);
    const [total, setTotal] = React.useState(0);
    const [refresh, setRefresh] = React.useState(0);

    /* Table Control */
    const [orderBy, setOrderBy] = React.useState('name');
    const [page, setPage] = React.useState(1);
    const [order, setOrder] = React.useState("asc");
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

    const [open, setOpen] = React.useState(false);
    const [toolId, setToolId] = React.useState(null);

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

    const handleSearch = (e) => {
        const barcode = e.target.value;
        if (e.key === 'Enter') {
            e.preventDefault();
            fetch(`http://localhost:5000/tools?barcode=${barcode}&order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}`)
            .then(res => res.json())
            .then((result) => {
                setIsLoaded(true);
                setActive(barcode);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setResults(result.content);
                    setTotal(result.pagination.total);
                }
            }, (error) => {
                setIsLoaded(true);
                setError(error);
            });
        }
    }

    return (
        <div>
            <Paper className={classes.root}>
                <TextField
                    fullWidth={true}
                    label="Search For Tool By Barcode"
                    InputProps={
                        {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }
                    }
                    onKeyPress={handleSearch}
                />
            </Paper>
            {!isLoaded ? (
                active && (
                    <Paper className={classes.paper}>
                        Loading...
                    </Paper>
                )
            ) : (
                error ? (
                    <Paper className={classes.paper}>
                        {error}
                    </Paper>
                ) : (
                    active && (
                        results.length > 0 ? (
                            <Paper className={classes.paper}>
                                <DataTableToolbar title="Search Results" />
                                <TableContainer>
                                    <Table className={classes.table} size="medium">  
                                        <DataTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} header={header}/>
                                        <TableBody>
                                            {results.map((row, index) => {
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                const link = `/history/${row.id}`;

                                                return (
                                                    <TableRow hover tabIndex={-1} key={labelId}>
                                                        <TableCell align="left">{row.name}</TableCell>
                                                        <TableCell align="left">{row.barcode}</TableCell>
                                                        <TableCell align="left">{row.purchase_date}</TableCell>
                                                        <TableCell align="center">{
                                                            row.borrowed ? (
                                                                <Tooltip title="Currently Borrowed"><ClearIcon color="secondary" /></Tooltip>
                                                            ) : (
                                                                row.lendable ? (
                                                                    <Tooltip title="Available"><DoneIcon color="primary" /></Tooltip>
                                                                ) : (
                                                                    <Tooltip title="Not Available For Lent"><ClearIcon color="disabled" /></Tooltip>
                                                                )
                                                            )
                                                        }</TableCell>
                                                        <TableCell align="left">
                                                            {row.categories.map((c, i) => {
                                                                return <Chip clickable component="a" href={"/category/" + c.id} key={i} className={classes.chip} label={c.name} />; 
                                                            })}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip title="Lend History">
                                                                <IconButton href={link}>
                                                                    <HistoryIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {row.borrowed || !row.lendable || (process.env.REACT_APP_USER_ID == row.user_id) ? (
                                                                <IconButton disabled={true} onClick={() => {setOpen(true)}} aria-label="Add Tool" color="primary">
                                                                    <LibraryAddIcon />
                                                                </IconButton>
                                                            ) : (
                                                                <Tooltip title="Borrow">
                                                                    <IconButton onClick={() => {setOpen(true); setToolId(row.id)}} aria-label="Add Tool" color="primary">
                                                                        <LibraryAddIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            <BorrowToolDialog tool_id={toolId} open={open} onClose={() => {setOpen(false)}} refresh={refresh} setRefresh={setRefresh}/>
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
                        ) : (
                            <Paper className={classes.root}>
                                Failed to find any results for {active}!
                            </Paper>
                        )
                    )
                )
            )}
        </div>
    )
}

export default Search;