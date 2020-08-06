import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import json2mq from 'json2mq';

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
    Fab, useMediaQuery,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
    Add, Refresh, ArrowUpward, ArrowDownward,
} from '@material-ui/icons';

import { Modal } from '../components';

// Api
import { readTransactions } from '../api';

// Helpers
import {
    formatDate, isPositiveNumber, toMoney, orderByDate,
} from '../helpers';

// Types
import { AlertMessage, Transaction, HomePageProps } from '../types';

// Styles
import { useStyles } from './styles';

const initialAlert: AlertMessage = {
    message: '',
    type: 'success',
};

const Index: NextPage<HomePageProps> = ({ transactions }) => {
    const [alertModal, setAlertModal] = useState<boolean>(false);
    const [expenseId, setExpenseId] = useState<string>('');
    const [expenses, setExpenses] = useState<Transaction[]>(transactions);
    const [pending, setPending] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertMessage>(initialAlert);
    const classes = useStyles();
    const isMobile: boolean = useMediaQuery(
        json2mq({
            maxWidth: 900,
        }),
    );

    const handleToggleModal = () => {
        setAlertModal((oldValue) => !oldValue);
    };

    const handleExpenseClick = (id: string) => () => {
        setExpenseId(id);
        handleToggleModal();
    };

    const handleDeleteExpense = async () => {
        try {
            setPending(true);

            const res: Response = await fetch(`/api/transactions/${expenseId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setExpenses(expenses.filter((expense: Transaction) => expense.id !== expenseId));

                handleToggleModal();

                setAlert({
                    message: 'Transaction deleted successfully',
                    type: 'success',
                });
            } else {
                const error = await res.text();

                throw new Error(error);
            }
        } catch (error) {
            setAlert({
                message: 'Something whent wrong',
                type: 'error',
            });
        } finally {
            setPending(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setPending(true);

            const response: Response = await fetch('/api/transactions', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const exps = await response.json() as Transaction[];
                const orderedExpenses = orderByDate<Transaction>(exps);

                setExpenses(orderedExpenses);
            } else {
                const error = await response.text();

                throw new Error(error);
            }
        } catch (error) {
            setAlert({
                message: 'Something whent wrong...',
                type: 'error',
            });
        } finally {
            setPending(false);
        }
    };

    return (
        <div>
            <div className={classes.root}>
                <h5 className={classes.heading}>
                    TRANSACTIONS LIST
                </h5>

                <Button
                    onClick={handleRefresh}
                    color="primary"
                    startIcon={<Refresh />}
                >
                    {isMobile ? '' : 'Refresh list'}
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
                                className={classes.listItemContainer}
                            >
                                <ListItemIcon
                                    className={
                                        clsx(classes.icon, { [classes.creditIcon]: isPositive })
                                    }
                                >
                                    {isPositive ? <ArrowUpward /> : <ArrowDownward />}
                                </ListItemIcon>

                                <ListItemText
                                    primary={formatDate(expense.date)}
                                    secondary={expense.description}
                                />

                                <ListItemSecondaryAction>
                                    <Tooltip title={isPositive ? 'Credited amount' : 'Amount debited'}>
                                        <b className={clsx(classes.expenseTotal, {
                                            [classes.isDebit]: isPositive,
                                        })}
                                        >
                                            {isPositive && '+ '}
                                            {toMoney(expense.amount, 'USD')}
                                        </b>
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>

            <Link href="/new">
                <Zoom
                    in
                    unmountOnExit
                    timeout={200}
                    style={{
                        transitionDelay: '400ms',
                    }}
                >
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
                isLoading={pending}
            >
                <span>
                    You&apos;re about to
                    {' '}
                    <b>delete</b>
                    {' '}
                    this transaction from the history list
                </span>
            </Modal>

            <Snackbar open={Boolean(alert.message)} autoHideDuration={6000}>
                <Alert severity={alert.type}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const expenses = await readTransactions();
    const orderedExpenses = orderByDate(expenses);

    return { props: { transactions: orderedExpenses } };
};

export default Index;
