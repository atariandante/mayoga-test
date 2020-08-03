import { useRouter } from 'next/router';
import clsx from 'clsx';

// Components
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    makeStyles
} from '@material-ui/core';
import { ViewModule, BarChart } from '@material-ui/icons';
import Link from "next/link";

// Make styles
const drawerWidth = 310;

const pages = [
    { name: 'Dashboard', icon: ViewModule, url: '/' },
    { name: 'stats', icon: BarChart, url: '/stats' }
]

const useStyles = makeStyles((theme) => ({
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
        backgroundColor: '#F6F8FF'
    },
    mainContent: {
        backgroundColor: '#FFF',
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        borderTopLeftRadius: 70,
        // Replace with theme
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
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        // TODO: Add theme
        backgroundColor: '#F6F8FF',
    },
    drawerOpen: {
        width: drawerWidth,
        // TODO: Add theme
        backgroundColor: '#F6F8FF',
        border: 'none',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    activeListItem: {
        color: theme.palette.primary.main
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export const Layout = ({ children }) => {
    const classes = useStyles();
    const router = useRouter();

    console.log(router.route);

    return (
        <div className={clsx(classes.mainWrapper)}>
            <CssBaseline />

            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, classes.drawerOpen)}
                classes={{paper: clsx(classes.drawerOpen)}}>
                <div className={classes.toolbar}>
                    LOGO
                </div>
                
                <List>
                    {pages.map((page, index) => {
                        const Icon = page.icon;

                        return (
                            <Link href={page.url}>
                                <ListItem
                                    button key={index}
                                    selected={page.url === router.route}
                                    className={clsx({
                                        [classes.activeListItem]: page.url === router.route
                                    })}
                                    classes={{
                                        selected: clsx(classes.activeListItem)
                                    }}>
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>

                                    <ListItemText primary={page.name}/>
                                </ListItem>
                            </Link>
                        );
                    })}
                </List>
            </Drawer>

            <main className={clsx(classes.mainContent)}>
                {children}
            </main>
        </div>
    )
};