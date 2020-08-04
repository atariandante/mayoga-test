import dayjs from 'dayjs';

export const formatDate = (date: string): string => {
    return dayjs(date).format('DD/MM/YYYY');
}

export const isPositiveNumber = (number: number): boolean => {
    // Boolean(-1) is true
    return Math.sign(number) === 1;
}

export const toMoney = (amount: string | number, currency: string) => {
    return `${amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${currency} `;
};