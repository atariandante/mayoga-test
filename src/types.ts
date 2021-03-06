import { Color } from '@material-ui/lab';

export type Transaction = {
    id: string;
    date: string;
    description: string;
    amount: number;
};

export type TransactionValues = Omit<Transaction, 'id'>;

export type AlertMessage = {
    message: string;
    type: Color
};

export type TransactionErrors = Omit<TransactionValues, 'amount'> & { amount: string };

export type HomePageProps = {
    transactions: Transaction[]
};
