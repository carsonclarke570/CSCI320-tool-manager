import React from 'react';
import clsx from 'clsx';

import { lighten, makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Checkbox  from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

export function DataTableHead (props) {
    const {
        onSelectAllClick, order, orderBy, 
        onRequestSort, header, checkbox, 
        numSelected, rowCount
    } = props;
    const createSortHandler = (property) => () => {
        onRequestSort(property);
    }

    return (
        <TableHead>
            <TableRow>
                {checkbox && (
                    <TableCell padding="checkbox">
                        <Checkbox  
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'Select All' }}
                            color="default"
                        />
                    </TableCell>
                )}
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
    highlight: theme.palette.type === 'light' ? {
        color: theme.palette.error.main,
        backgroundColor: lighten(theme.palette.error.light, 0.85),
    } : {
        color: theme.palette.text.error,
        backgroundColor: theme.palette.error.dark,
    },
    title: {
        flex: '1 1 100%',
    },
}));

export function DataTableToolbar (props) {
    const classes = useStyles();
    const {title, numSelected, onDelete} = props;

    return (
        <Toolbar 
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            }
        )}>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {title}
            </Typography>

            {numSelected > 0 && (
                <Tooltip title="Remove">
                    <IconButton aria-label="Remove" onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}

            {numSelected == 0 && (
                props.children
            )}
        </Toolbar>
    )
}