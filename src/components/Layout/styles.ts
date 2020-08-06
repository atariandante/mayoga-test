import { makeStyles, Theme } from '@material-ui/core';

const drawerWidth = 310;

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    mainWrapper: {
        backgroundColor: theme.palette.grey[100],
    },
    mainContent: {
        backgroundColor: theme.palette.common.white,
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        minHeight: '100vh',
        paddingLeft: theme.spacing(10),
        paddingRight: theme.spacing(10),
        paddingBottom: theme.spacing(5),
        paddingTop: theme.spacing(5),
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    mobileMainContent: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.common.white,
    },
    drawer: {
        width: drawerWidth,
        backgroundColor: theme.palette.grey[100],
        border: 'none',
    },
    activeListItem: {
        color: theme.palette.primary.main,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        transition: theme.transitions.create('border', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    activeListItemIcon: {
        color: theme.palette.primary.main,
        fontWeight: 800,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(0, 1),
        paddingTop: theme.spacing(5),
        fontSize: 20,
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        margin: 0,
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    ul: {
        padding: 0,
    },
}));
