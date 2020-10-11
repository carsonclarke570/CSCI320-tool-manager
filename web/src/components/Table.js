import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export function DataTableHead (props) {
    const {classes, order, orderBy, onRequestSort, header} = props;
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    }

    return (
        <TableHead>
            <TableRow>
                {header.map((cell) => (
                    <TableCell key={cell.id ? cell.id : cell.label} align={cell.numeric ? 'right': 'left'} padding={cell.paddingOff ? 'none' : 'default'} sortDirection={orderBy === cell.id ? order : false}>
                        <TableSortLabel active={orderBy === cell.id} direction={order} onClick={cell.id !== null ? createSortHandler(cell.id) : () => {}}>
                        {cell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    title: {
      flex: '1 1 100%',
    },
}));

export function DataTableToolbar (props) {
    const classes = useStyles();
    const {title} = props;

    return (
        <Toolbar className={classes.root}>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {title}
            </Typography>
        </Toolbar>
    )
}