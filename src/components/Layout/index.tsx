import React, { useState } from 'react';
import { useRouter } from 'next/router';
import json2mq from 'json2mq';
import clsx from 'clsx';
import { motion } from 'framer-motion';

// Components
import Link from 'next/link';
import {
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    SwipeableDrawer,
    useMediaQuery
} from '@material-ui/core';
import { ViewModule, Add, FormatListBulleted } from '@material-ui/icons';

// Styles
import { useStyles } from './styles';

// Variants
import { list, item, text } from '../../motions';

// Types
import { LayoutProps } from './types';

// Constants
import { github } from '../../contants';

const pages = [
    { name: 'Dashboard', icon: ViewModule, url: '/' },
    { name: 'Create new transaction', icon: Add, url: '/new' }
]

export const Layout = ({ children }: LayoutProps) => {
    const [drawer, setDrawer] = useState<boolean>(false);
    const router = useRouter();
    const classes = useStyles();
    const isMobile: boolean = useMediaQuery(
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
            <div className={classes.contentWrapper}>
                <div>
                    <motion.h5 className={classes.toolbar} initial="hidden" animate="visible" variants={text}>
                        LOGO / BRAND
                    </motion.h5>

                    <motion.ul
                        initial="hidden"
                        animate="visible"
                        variants={list}
                        className={classes.ul}>
                        {pages.map((page, index) => {
                            const Icon = page.icon;

                            return (
                                <Link href={page.url} key={index}>
                                    <motion.li variants={item}>
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
                                                root: page.url === router.route ? classes.activeListItemIcon : undefined
                                            }}>
                                                <Icon />
                                            </ListItemIcon>

                                            <ListItemText primary={page.name}/>
                                        </ListItem>
                                    </motion.li>
                                </Link>
                            );
                        })}
                    </motion.ul>
                </div>

                <motion.h5 className={classes.waterMark} initial="hidden" animate="visible" variants={text} custom={0.5}>
                    Coded with ❤️ by <a href={github} target="_blank">@atariandante</a>
                </motion.h5>
            </div>
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