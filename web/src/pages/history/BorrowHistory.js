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
import Button from '@material-ui/core/Button';

import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import HistoryIcon from '@material-ui/icons/History';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

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
    {id: null, numeric: false, paddingOff: false, label: "Borrowed By"},
    {id: null, numeric: false, paddingOff: false, label: "Borrowed On"},
    {id: null, numeric: null, paddingOff: false, label: "Currently Borrowed"},
    {id: null, numeric: true, paddingOff: false, label: "Returned On"},
];

function BorrowHistory(props) {
    const classes = useStyles();

    /* Path Params */
    const {id} = useParams();

    /* State */
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(0);

    const [user, setUser] = React.useState({});
    const [tool, setTool] = React.useState({});
    const [history, setHistory] = React.useState({
        history: []
    });

    /* Effects */
    useEffect(() => {

        // Fetch tool
        fetch(`http://localhost:5000/tools/${id}/`)
            .then(res => res.json())
            .then((result) => {
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setTool(result.content);
                    fetch(`http://localhost:5000/users/${result.content.user_id}`)
                        .then(res => res.json())
                        .then((result) => {
                            setIsLoaded(true);
                            if (result.code !== 200) {
                                setError(result.content);
                            } else {
                                setUser(result.content);
                            }
                        }, (error) => {
                            setIsLoaded(true);
                            setError(error);
                        });
                }
            }, (error) => {
                setIsLoaded(true);
                setError(error);
            });

        // Fetch his
        fetch(`http://localhost:5000/borrows/history/${id}`)
            .then(res => res.json())
            .then((result) => {
                setLoaded(true);
                if (result.code !== 200) {
                    setError(result.content);
                } else {
                    setHistory(result.content);
                    setTotal(result.pagination.total);
                }
            }, (error) => {
                setLoaded(true);
                setError(error);
            });
    }, [page, rowsPerPage, props.refresh]);

    /* Handlers */
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

    if (!isLoaded || !loaded) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <Paper className={classes.root}>
            <DataTableToolbar title={"Lend History"}/>
            <TableContainer>
                <Table className={classes.table} size="medium">  
                    <DataTableHead classes={classes} header={header}/>
                    <TableBody>
                        {history.history.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow 
                                    hover 
                                    tabIndex={-1} 
                                    key={`${row.id}`}
                                    className={classes.tableRow}
                                >
                                    <TableCell align="left">{row.user.first_name} {row.user.last_name}</TableCell>
                                    <TableCell align="left">{row.borrowed_on}</TableCell>
                                    <TableCell align="center">{row.borrowed ? (
                                        <DoneIcon />
                                    ) : (
                                        <ClearIcon />
                                    )}</TableCell>
                                    <TableCell align="right">{row.borrowed ? (
                                        `Due on: ${row.return_date}`
                                    ) : (
                                        row.return_date
                                    )}</TableCell>
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

export default BorrowHistory;