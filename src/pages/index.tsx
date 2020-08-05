import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import clsx from 'clsx';

// Components
import {
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Tooltip,
    Zoom,
    Snackbar,
    Fab,
    makeStyles,
    Theme
} from '@material-ui/core';
import { Alert } from "@material-ui/lab";
import { Add, Refresh, ArrowUpward, ArrowDownward } from '@material-ui/icons';

// Api
import { readTransactions } from '../api';

// Helpers
import { formatDate, isPositiveNumber, toMoney, orderByDate } from '../helpers';

// Types
import { AlertMessage, Transaction } from '../types';
import { Modal } from "../components";

// Styles
import { useStyles } from './styles';

const initialAlert: AlertMessage = {
    message: '',
    type: 'success'
}

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
                {expenses.map((expense: Transaction) => {
                    const isPositive: boolean = isPositiveNumber(expense.amount);

                    return (
                        <Tooltip title="Click to remove this transaction" key={expense.id}>
                            <ListItem
                                button
                                onClick={handleExpenseClick(expense.id)}
                                className={classes.listItemContainer}>
                                <ListItemIcon
                                    className={
                                        clsx(classes.icon, {[classes.creditIcon]: isPositive })
                                    }>
                                    {isPositive ? <ArrowUpward /> : <ArrowDownward />}
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

            <Link href="/new">
                <Zoom
                    in
                    unmountOnExit
                    timeout={200}
                    style={{
                        transitionDelay: '400ms',
                    }}>
                    <Fab color="primary" className={classes.fab}>
                        <Add />
                    </Fab>
                </Zoom>
            </Link>

            <Modal
                title="Wait!"
                show={alertModal || pending}
                onClickAction={handleDeleteExpense}
                onClose={handleToggleModal}
                isLoading={pending}>
                <span>
                    You're about to <b>delete</b> this transaction from the history list
                </span>
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
