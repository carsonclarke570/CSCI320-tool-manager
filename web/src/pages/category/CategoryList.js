import React, {
    useEffect,
} from 'react';
import { useParams } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import HistoryIcon from '@material-ui/icons/History';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import { DataTableHead, DataTableToolbar } from '../../components/Table';
import BorrowToolDialog from '../users/BorrowToolDialog';

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
    {id: "purchase_date", numeric: false, paddingOff: false, label: "Purchase Date"},
    {id: null, numeric: false, paddingOff: false, label: "Categories"},
    {id: null, numeric: null, paddingOff: false, label: "Available to Lend"},
    {id: null, numeric: true, paddingOff: false, label: "Actions"},
];

function CategoryList(props) {
    const classes = useStyles();

    /* Path Params */
    const {id} = useParams();

    /* State */
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    
    const [orderBy, setOrderBy] = React.useState('name');
    const [page, setPage] = React.useState(1);
    const [order, setOrder] = React.useState("asc");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(0);

    const [category, setCategory] = React.useState({});
    const [tools, setTools] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [toolId, setToolId] = React.useState(null);

    /* Effects */
    useEffect(() => {
        fetch(`http://localhost:5000/categories/${id}/`)
            .then(res => res.json())
            .then((result) => {
                setIsLoaded(true);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setCategory(result.content);
                }
            }, (error) => {
                setIsLoaded(true);
                setError(error);
            });

        fetch(`http://localhost:5000/categories/list/${id}/?order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}`)
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

    /* Handlers */
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

    if (error) {
        return (
            <div>Error: {error.message}</div>
        );
    }

    if (!isLoaded) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <Paper className={classes.root}>
            <DataTableToolbar title={"Category - " + category.name} />
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} header={header}/>
                    <TableBody>
                        {tools.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            const link = `/history/${row.id}`;

                            return (
                                <TableRow 
                                    hover 
                                    tabIndex={-1} 
                                    key={`${row.id}`}
                                    className={classes.tableRow}
                                >
                                    <TableCell component="th" id={labelId} scope="row" paddding="none" align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.barcode}</TableCell>
                                    <TableCell align="left">{row.purchase_date}</TableCell>
                                    <TableCell align="left">
                                        {row.categories.map((c, i) => {
                                            return <Chip clickable component="a" href={"/category/" + c.id} key={i} className={classes.chip} label={c.name} />; 
                                        })}
                                    </TableCell>
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
                                    <TableCell align="right">
                                        <Tooltip title="Lend History">
                                            <IconButton href={link}>
                                                <HistoryIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {row.borrowed || !row.lendable ? (
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
                                        <BorrowToolDialog tool_id={toolId} open={open} onClose={() => {setOpen(false)}} refresh={props.refresh} setRefresh={props.setRefresh}/>
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

export default CategoryList;