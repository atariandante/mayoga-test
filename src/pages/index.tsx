import { useState } from 'react';
import { NextPage } from 'next';
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
    Fab,
    Typography,
    makeStyles,
    Theme
} from '@material-ui/core';
import { Folder, Add } from '@material-ui/icons';

// Api
import { readTransactions } from '../api';

// Helpers
import { formatDate, isPositiveNumber, toMoney } from '../helpers';
import {Transaction} from "../types";
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 0
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
        color: theme.palette.secondary.light,
        cursor: 'default'
    },
    listItemContainer: {
        borderRadius: 70
    },
    isDebit: {
        color: theme.palette.primary.light
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));

const Index: NextPage = (props: any) => {
    const [alertModal, setAlertModal] = useState<boolean>(false);
    const [expenseId, setExpenseId] = useState<string>('');
    const [expenses, setExpenses] = useState<Transaction[]>(props.expenses);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<any>();
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

            await fetch(`/api/transactions/${expenseId}`, {
                method: 'DELETE'
            });

            setExpenses(expenses.filter(expense => expense.id !== expenseId));

            handleToggleModal();
        } catch (error) {
            setError(error);
        } finally {
            setPending(false);
        }

    }

    return (
        <div>
            <div className={classes.root}>
                <h6 className={classes.heading}>
                    EXPENSO APP
                </h6>

                <div>
                    Search here maybe
                </div>
            </div>

            <List>
                {expenses.map(expense => {
                    const isPositive: boolean = isPositiveNumber(expense.amount);

                    return (
                        <Tooltip title="Click to remove this transaction">
                            <ListItem
                                button
                                onClick={handleExpenseClick(expense.id)}
                                key={expense.id}
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
                    <Fab color="primary" className={classes.fab}>
                        <Add />
                    </Fab>
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
                                    <Button color="primary" onClick={handleToggleModal}>
                                        Ups! Get me back
                                    </Button>

                                    <Button variant="outlined" color="secondary" onClick={handleDeleteExpense}>
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
        </div>
    )
};

export const getServerSideProps = async () => {
    const expenses = await readTransactions();
    const orderedExpenses = expenses.sort((a, b) => {
        const current = new Date(b.date).getTime();
        const next = new Date(a.date).getTime();

        return current - next;
    })

    return { props: { expenses: orderedExpenses }};
}

export default Index;
