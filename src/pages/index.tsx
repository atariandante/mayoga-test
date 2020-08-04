import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import clsx from 'clsx';

// Components
import {
    Button,
    Modal,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Paper,
    CircularProgress,
    Tooltip,
    Zoom,
    Snackbar,
    Fab,
    Typography,
    makeStyles,
    Theme
} from '@material-ui/core';
import { Folder, Add, Refresh } from '@material-ui/icons';

// Api
import { readTransactions } from '../api';

// Helpers
import { formatDate, isPositiveNumber, toMoney, orderByDate } from '../helpers';

// Types
import { AlertMessage, Transaction } from '../types';
import { Alert } from "@material-ui/lab";

const initialAlert: AlertMessage = {
    message: '',
    type: 'success'
}

const useStyles = makeStyles((theme: Theme) => ({
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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalText: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(4)
    },
    expenseTotal: {
        fontSize: 15,
        color: theme.palette.error.main,
        cursor: 'default'
    },
    listItemContainer: {
        borderRadius: 70
    },
    isDebit: {
        color: theme.palette.success.dark,
        padding: theme.spacing(1),
        backgroundColor: theme.palette.success.light,
        borderRadius: 5
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    dangerButton: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main
    }
}));

const Index: NextPage = (props: any) => {
    const [alertModal, setAlertModal] = useState<boolean>(false);
    const [expenseId, setExpenseId] = useState<string>('');
    const [expenses, setExpenses] = useState<Transaction[]>(props.expenses);
    const [pending, setPending] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertMessage>(initialAlert)
    const classes = useStyles();

    const handleToggleModal = () => {
        setAlertModal(oldValue => !oldValue);
    };

    const handleExpenseClick = (id: string) => () => {
        setExpenseId(id)
        handleToggleModal();
    };

    const handleDeleteExpense = async () => {
        try {
            setPending(true);

            const res = await fetch(`/api/transactions/${expenseId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setExpenses(expenses.filter(expense => expense.id !== expenseId));

                handleToggleModal();

                setAlert({
                    message: 'Transaction deleted successfully',
                    type: 'success'
                })
            } else {
                res.text().then(response => {
                    throw response
                })
            }
        } catch (error) {
            setAlert({
                message: 'Something whent wrong',
                type: 'error'
            })
        } finally {
            setPending(false);
        }

    }

    const handleRefresh = async () => {
        try {
            setPending(true);

            const response = await fetch(`/api/transactions`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                response.json().then<Transaction[]>(res => {
                    const orderedExpenses = orderByDate<Transaction>(res);

                    setExpenses(orderedExpenses);

                    return res;
                });
            } else {
                response.text().then(error => { throw error });
            }

        } catch (error) {
            setAlert({
                message: 'Something whent wrong...',
                type: 'error'
            })
        } finally {
            setPending(false)
        }
    }

    return (
        <div>
            <div className={classes.root}>
                <h5 className={classes.heading}>
                    TRANSACTIONS LIST
                </h5>

                <Button
                    onClick={handleRefresh}
                    color="primary"
                    startIcon={<Refresh />}>
                    Refresh list
                </Button>
            </div>

            <List>
                {expenses.map(expense => {
                    const isPositive: boolean = isPositiveNumber(expense.amount);

                    return (
                        <Tooltip title="Click to remove this transaction" key={expense.id}>
                            <ListItem
                                button
                                onClick={handleExpenseClick(expense.id)}
                                className={classes.listItemContainer}>
                                <ListItemIcon>
                                    <Folder />
                                </ListItemIcon>

                                <ListItemText
                                    primary={formatDate(expense.date)}
                                    secondary={expense.description}
                                />

                                <ListItemSecondaryAction>
                                    <Tooltip title={isPositive ? 'Credited amount' : 'Amount debited'}>
                                        <b className={clsx(classes.expenseTotal, {
                                            [classes.isDebit]: isPositive
                                        })}>
                                            {isPositive && '+ '}
                                            {toMoney(expense.amount, 'USD')}
                                        </b>
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                      </Tooltip>
                    )
                })}
            </List>

            <Tooltip title="Add new transaction">
                <Link href="/new">
                    <Zoom
                        in
                        timeout={200}
                        style={{
                            transitionDelay: '400ms',
                        }}
                        unmountOnExit>
                        <Fab color="primary" className={classes.fab}>
                            <Add />
                        </Fab>
                    </Zoom>
                </Link>
            </Tooltip>

            <Modal
                className={classes.modal}
                open={alertModal || pending}
                onClose={handleToggleModal}>
                <Paper elevation={3} className={classes.paper}>
                    {!pending && (
                        <>
                           <Typography component="h5" variant="h5">
                               Wait!
                           </Typography>

                            <p className={classes.modalText}>
                                You're about to <b>delete</b> this transaction from the history list
                            </p>

                            <div className={classes.modalFooter}>
                                <Button
                                    color="primary"
                                    onClick={handleToggleModal}>
                                    Ups! Get me back
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleDeleteExpense}
                                    classes={{
                                        outlined: classes.dangerButton
                                    }}>
                                    I know, delete it
                                </Button>
                            </div>
                       </>
                    )}

                    {pending && (
                        <CircularProgress />
                    )}
                </Paper>
            </Modal>

            <Snackbar open={Boolean(alert.message)} autoHideDuration={6000}>
                <Alert severity={alert.type}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    )
};

export const getServerSideProps = async () => {
    const expenses = await readTransactions();
    const orderedExpenses = orderByDate(expenses)

    return { props: { expenses: orderedExpenses }};
}

export default Index;
