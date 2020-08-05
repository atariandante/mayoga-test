import React from 'react';
import {
    Button, CircularProgress, Grow, Paper, Modal as ModalContainer, Typography,
} from '@material-ui/core';

// Styles
import { useStyles } from './styles';

// Types
import { ModalProps } from './types';

export const Modal = ({
    show,
    onClose,
    isLoading,
    onClickAction,
    title,
    children,
}: ModalProps) => {
    const classes = useStyles();

    return (
        <ModalContainer
            className={classes.wrapper}
            open={show}
            onClose={onClose}
        >
            <Grow in={show} unmountOnExit timeout={200}>
                <Paper elevation={3} className={classes.paper}>
                    {!isLoading && (
                        <>
                            <Typography component="h5" variant="h5">
                                {title}
                            </Typography>

                            <p className={classes.content}>
                                {children}
                            </p>

                            <div className={classes.footer}>
                                <Button
                                    color="primary"
                                    onClick={onClose}
                                >
                                    Ups! Get me back
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={onClickAction}
                                    classes={{
                                        outlined: classes.actionButton,
                                    }}
                                >
                                    I know, delete it
                                </Button>
                            </div>
                        </>
                    )}

                    {isLoading && (
                        <CircularProgress />
                    )}
                </Paper>
            </Grow>
        </ModalContainer>
    );
};
