import { useState, ChangeEvent, FormEvent } from 'react';
import { NextPage } from 'next';
import clsx from 'clsx';

// Components
import {
    Button, TextField, CircularProgress, Snackbar,
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

// Types
import { TransactionValues, AlertMessage, TransactionErrors } from '../../types';

// Constants
import { defaultErrors } from '../../contants';

// Styles
import { useStyles } from './styles';

const initialState: TransactionValues = {
    date: '',
    description: '',
    amount: 0,
};

const initialErrors: TransactionErrors = {
    ...initialState,
    amount: '',
};

const initialAlert: AlertMessage = {
    message: '',
    type: 'success',
};

const New: NextPage = () => {
    const [formData, setFormData] = useState<TransactionValues>(initialState);
    const [errors, setErrors] = useState<TransactionErrors>(initialErrors);
    const [valid, setValid] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertMessage>(initialAlert);
    const classes = useStyles();

    const clearError = (field: keyof TransactionValues) => {
        setErrors((formErrors: TransactionErrors) => ({
            ...formErrors,
            [field]: '',
        }));
    };

    const handleValidate = () => {
        const fields: Array<keyof TransactionValues> = Object.keys(
            formData,
        ) as Array<keyof TransactionValues>;

        fields.forEach((field: keyof TransactionValues) => {
            if (!formData[field] && formData[field] !== 0) {
                setErrors((formErrors: TransactionErrors) => ({
                    ...formErrors,
                    [field]: defaultErrors.cantBeEmpty,
                }));

                setValid(false);
            } else if (field === 'amount' && formData[field] === 0) {
                setErrors((formErrors: TransactionErrors) => ({
                    ...formErrors,
                    [field]: defaultErrors.cantBeZero,
                }));

                setValid(false);
            } else {
                setValid(true);
            }
        });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const { name } = event.target;

        setFormData((formValues: TransactionValues) => ({
            ...formValues,
            [name]: value,
        }));

        clearError(name as keyof TransactionValues);
    };

    const handleSubmit = async (event: FormEvent) => {
        if (event && event.preventDefault) event.preventDefault();

        if (valid) {
            setPending(true);

            try {
                await fetch('/api/transactions', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                setAlert({
                    message: 'Transactions submitted successfully!',
                    type: 'success',
                });

                setFormData(initialState);
            } catch (error) {
                setAlert({
                    message: 'Something went wrong!',
                    type: 'error',
                });
            } finally {
                setPending(false);
            }
        }
    };

    const handleCloseAlert = () => {
        setAlert(initialAlert);
    };

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
                                    classes.spacedInput,
                                ),
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
                                root: classes.input,
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
                                root: classes.input,
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
                                endIcon={<CloudUpload />}
                            >
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
};

export default New;
