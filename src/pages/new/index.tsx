import { useState } from 'react';
import { NextPage } from 'next';
import clsx from 'clsx';

// Components
import { Button, TextField, makeStyles, CircularProgress, Snackbar, Paper, Theme } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

// Types
import { TransactionValues, AlertMessage } from '../../types';

// Contants
import { defaultErrors } from '../../contants';

const useStyles = makeStyles((theme: Theme) => ({
    head: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40
    },
    headText: {
        ...theme.typography.h5,
        color: theme.palette.primary.main
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
        marginRight: theme.spacing(2)
    },
    submitButton: {
        margin: theme.spacing(1),
        position: 'relative',
        display: 'flex',
        flex: 1
    },
    submitSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

const initialState: TransactionValues = {
    date: '',
    description: '',
    amount: 0
}

// Overriding amount key
const initialErrors: Omit<TransactionValues, 'amount'> & { amount: string } = {
    ...initialState,
    amount: ''
}

const initialAlert: AlertMessage = {
    message: '',
    type: 'success'
}

const New: NextPage = () => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState(initialErrors);
    const [valid, setValid] = useState<boolean>(false)
    const [pending, setPending] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertMessage>(initialAlert);
    const classes = useStyles();

    const handleValidate = () => {
        const fields = Object.keys(formData);

        fields.map(field => {
            if (!formData[field] && formData[field] !== 0) {
                setErrors(errors => ({
                    ...errors,
                    [field]: defaultErrors.cantBeEmpty
                }))

                setValid(false)
            } else if (field === 'amount' && formData[field] === 0) {
                setErrors(errors => ({
                    ...errors,
                    [field]: defaultErrors.cantBeZero
                }))

                setValid(false);
            } else {
                setValid(true);
            }
        })
    };

    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        
        setFormData(formData => ({
            ...formData,
            [name]: value
        }))

        clearError(name);
    }

    const handleSubmit = async (event) => {
        event && event.preventDefault()

        if (valid) {
            setPending(true);

            try {
                await fetch(`/api/transactions`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                setAlert({
                    message: 'Transactions submitted successfully!',
                    type: 'success'
                })
                
                setFormData(initialState)
            } catch (error) {
                setAlert({
                    message: 'Something went wrong!',
                    type: 'error'
                })
            } finally {
                setPending(false);
            }
        }
    };

    const handleCloseAlert = () => {
        setAlert(initialAlert);
    }

    const clearError = (field: keyof TransactionValues) => {
        setErrors(errors => ({
            ...errors,
            [field]: ''
        }))
    }

    return (
        <div>
            <div className={classes.head}>
                <h5 className={classes.headText}>
                    CREATE NEW TRANSACTION
                </h5>
            </div>

            <div className={classes.formWrapper}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <div className={classes.formRow}>
                        <TextField
                            name="date"
                            onChange={handleChange}
                            onBlur={handleValidate}
                            error={Boolean(errors.date)}
                            classes={{
                                root: clsx(
                                    classes.input,
                                    classes.spacedInput
                                )
                            }}
                            label="Date"
                            type="date"
                            placeholder="Insert invoice date"
                            variant="outlined"
                            helperText={errors.date}
                        />

                        <TextField
                            name="amount"
                            onChange={handleChange}
                            onBlur={handleValidate}
                            classes={{
                                root: classes.input
                            }}
                            error={Boolean(errors.amount)}
                            defaultValue={initialState.amount}
                            type="number"
                            label="Amount"
                            placeholder="Insert amount of the transaction"
                            variant="outlined"
                            helperText={errors.amount}
                        />
                    </div>

                    <div className={classes.formRow}>
                        <TextField
                            name="description"
                            onChange={handleChange}
                            onBlur={handleValidate}
                            classes={{
                                root: classes.input
                            }}
                            error={Boolean(errors.description)}
                            multiline
                            rows={4}
                            rowsMax={8}
                            label="Description"
                            placeholder="Insert some description about the transaction"
                            variant="outlined"
                            helperText={errors.description}
                        />
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.submitButton}>
                            <Button
                                fullWidth
                                type="submit"
                                size="large"
                                color="primary"
                                disabled={pending}
                                endIcon={<CloudUpload />}>
                                Submit
                            </Button>

                            {pending && <CircularProgress size={24} className={classes.submitSpinner} />}
                        </div>
                    </div>
                </form>
                
                <Snackbar open={Boolean(alert.message)} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert severity={alert.type}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default New;
