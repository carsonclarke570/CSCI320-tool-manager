import React, {
    useEffect,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { DataTableHead, DataTableToolbar } from '../../components/Table';
import { Table, TableBody, TableContainer, TableRow, TableCell, TablePagination } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import HistoryIcon from '@material-ui/icons/History';

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
    {id: "name", numeric: false, paddingOff: false, label: "Tool Name"},
    {id: "barcode", numeric: false, paddingOff: false, label: "Barcode"},
    {id: "purchase_date", numeric: false, paddingOff: false, label: "Purchased On"},
    {id: "removed_date", numeric: false, paddingOff: false, label: "Removed On"},
    {id: null, numeric: false, paddingOff: false, label: "Categories"},
    {id: null, numeric: true, paddingOff: false, label: "Actions"}
];

function RemovedTable(props) {
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
        fetch(`http://localhost:5000/tools/unarchive/`, {
            method: 'post',
            body: JSON.stringify([id]),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(() => {
            props.setRefresh(props.refresh + 1);
        });
    };

    useEffect(() => {
        fetch(`http://localhost:5000/tools/removed/${process.env.REACT_APP_USER_ID}?order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}`)
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
            <DataTableToolbar title="Removed Tools" />
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} header={header}/>
                    <TableBody>
                        {tools.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            const link = `/history/${row.id}`;

                            return (
                                <TableRow hover tabIndex={-1} key={labelId}>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.barcode}</TableCell>
                                    <TableCell align="left">{row.purchase_date}</TableCell>
                                    <TableCell align="left">{row.removed_date}</TableCell>
                                    <TableCell align="left">
                                        {row.categories.map((c, i) => {
                                            return <Chip className={classes.chip} label={c.name} />; 
                                        })}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Lend History">
                                            <IconButton href={link}>
                                                <HistoryIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Add Back">
                                            <IconButton onClick={handleReturn(row.id)}>
                                                <KeyboardReturnIcon color="primary" />
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

export default RemovedTable;