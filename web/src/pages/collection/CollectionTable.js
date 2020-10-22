import React, {
    useEffect,
} from 'react';

import { lighten, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { DataTableHead, DataTableToolbar } from '../../components/Table';
import { Table, TableBody, TableContainer, TableRow, TableCell, TablePagination } from '@material-ui/core';
import Checkbox  from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import HistoryIcon from '@material-ui/icons/History';

import AddToolDialog from './AddToolDialog';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        borderRadius: '0px',
        marginBottom: theme.spacing(2)
    },
    tableRow: theme.palette.type === 'light' ? {
        "&$selected, &$selected:hover": {
            backgroundColor: lighten(theme.palette.error.light, 0.85),
        }
    } : {
        "&$selected, &$selected:hover": {
            backgroundColor: theme.palette.error.dark,
        }
    },
    tableCell: theme.palette.type === 'light' ? {
        "$selected &": {
            color: theme.palette.error.main,
        }
    } : {
        "$selected &": {
            backgroundColor: theme.palette.error.dark,
        }
    },
    hover: {},
    selected: {},
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
    {id: "name", numeric: false, paddingOff: true, label: "Tool Name"},
    {id: "barcode", numeric: false, paddingOff: false, label: "Barcode"},
    {id: "purchase_date", numeric: false, paddingOff: false, label: "Purchased On"},
    {id: null, numeric: false, paddingOff: false, label: "Categories"},
    {id: "lendable", numeric: null, paddingOff: false, label: "Available to Lend"},
    {id: null, numeric: true, paddingOff: false, label: "Actions"},
];

function CollectionTable(props) {
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
    const [selected, setSelected] = React.useState([]);

    /* Add Tools Dialog */
    const [open, setOpen] = React.useState(false);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = tools.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;

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

    const handleDelete = (ids) => (event) => {
        fetch(`http://localhost:5000/tools/archive/`, {
            method: 'post',
            body: JSON.stringify(ids),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(() => {
            props.setRefresh(props.refresh + 1);
            setSelected([]);
        })
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
    
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
    
        setSelected(newSelected);
    };

    useEffect(() => {
        fetch(`http://localhost:5000/tools/?user_id=${process.env.REACT_APP_USER_ID}&order_by=${orderBy}&order=${order}&p=${page}&n=${rowsPerPage}&removed_date=null`)
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
            <DataTableToolbar onDelete={handleDelete(selected)} title="Collection" numSelected={selected.length}>
                <Tooltip title="Add Tool">
                    <IconButton onClick={() => {setOpen(true)}} aria-label="Add Tool" color="primary">
                        <AddIcon />
                        <AddToolDialog open={open} onClose={() => {setOpen(false)}} refresh={props.refresh} setRefresh={props.setRefresh}/>
                    </IconButton>
                </Tooltip>
            </DataTableToolbar>
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead numSelected={selected.length} rowCount={total} checkbox="True" classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} onSelectAllClick={handleSelectAllClick} header={header}/>
                    <TableBody>
                        {tools.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            const link = `/history/${row.id}`;

                            return (
                                <TableRow 
                                    hover 
                                    onClick={(event) => handleClick(event, row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1} 
                                    key={row.name + `${index}`}
                                    selected={isItemSelected}
                                    classes={{ selected: classes.selected }}
                                    className={classes.tableRow}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            className={classes.tableCell}
                                        />
                                    </TableCell>
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

export default CollectionTable;