import React, { useState } from 'react';
import { useRouter } from 'next/router';
import json2mq from 'json2mq';
import clsx from 'clsx';

// Components
import Link from 'next/link';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    SwipeableDrawer,
    makeStyles,
    useMediaQuery
} from '@material-ui/core';
import { ViewModule, Add, FormatListBulleted } from '@material-ui/icons';

// Make styles
const drawerWidth = 310;

const pages = [
    { name: 'Dashboard', icon: ViewModule, url: '/' },
    { name: 'Create new transaction', icon: Add, url: '/new' }
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
        backgroundColor: theme.palette.grey[100]
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
        padding: theme.spacing(5),
        backgroundColor: theme.palette.common.white
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
        fontWeight: 800
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
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export const Layout = ({ children }) => {
    const [drawer, setDrawer] = useState(false);
    const classes = useStyles();
    const router = useRouter();
    const isMobile = useMediaQuery(
        json2mq({
            maxWidth: 900
        })
    );

    const toggleDrawer = (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawer(old => !old);
    };

    const renderContent = () => {
        return (
            <>
                <div className={classes.toolbar}>
                    LOGO / BRAND
                </div>

                <List>
                    {pages.map((page, index) => {
                        const Icon = page.icon;

                        return (
                            <Link href={page.url} key={index}>
                                <ListItem
                                    button
                                    onClick={toggleDrawer}
                                    selected={page.url === router.route}
                                    className={clsx({
                                        [classes.activeListItem]: page.url === router.route
                                    })}
                                    classes={{
                                        selected: classes.activeListItem,
                                    }}>
                                    <ListItemIcon classes={{
                                        root: page.url === router.route && classes.activeListItemIcon
                                    }}>
                                        <Icon />
                                    </ListItemIcon>

                                    <ListItemText primary={page.name}/>
                                </ListItem>
                            </Link>
                        );
                    })}
                </List>
            </>
        )
    }

    if (isMobile) {
        return (
            <div className={classes.mainWrapper}>
                <SwipeableDrawer
                    anchor="left"
                    open={drawer}
                    onClose={toggleDrawer}
                    onOpen={toggleDrawer}>
                    {renderContent()}
                </SwipeableDrawer>

                <main className={classes.mobileMainContent}>
                    <Button
                        onClick={toggleDrawer}
                        color="primary"
                        startIcon={<FormatListBulleted />} />

                    {children}
                </main>
            </div>
        )
    }

    return (
        <div className={clsx(classes.mainWrapper)}>
            <Drawer
                variant="permanent"
                className={classes.drawer}
                classes={{paper: clsx(classes.drawer)}}>
                {renderContent()}
            </Drawer>

            <main className={clsx(classes.mainContent)}>
                {children}
            </main>
        </div>
    )
};