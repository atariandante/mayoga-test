import { makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40
    },
    heading: {
        ...theme.typography.h5,
        color: theme.palette.primary.main
    },
    expenseTotal: {
        fontSize: 15,
        padding: theme.spacing(1),
        color: theme.palette.error.dark,
        backgroundColor: theme.palette.error.light,
        cursor: 'default',
        borderRadius: 5
    },
    listItemContainer: {
        borderRadius: 10
    },
    isDebit: {
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    icon: {
        color: theme.palette.error.main
    },
    creditIcon: {
        color: theme.palette.success.main
    }
}));
