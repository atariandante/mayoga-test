import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
    },
    footer: {
        display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
    },
    content: {
        marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(4)
    },
    actionButton: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main
    },
}));
