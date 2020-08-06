import { makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
    head: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    headText: {
        ...theme.typography.h5,
        color: theme.palette.primary.main,
    },
    form: {
        width: 800,
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    formWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formRow: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: theme.spacing(4),
    },
    input: {
        flex: 1,
    },
    spacedInput: {
        marginRight: theme.spacing(2),
    },
    submitButton: {
        margin: theme.spacing(1),
        position: 'relative',
        display: 'flex',
        flex: 1,
    },
    submitSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));
