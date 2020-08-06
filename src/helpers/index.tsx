import dayjs from 'dayjs';

export const formatDate = (date: string): string => dayjs(date).format('DD/MM/YYYY');

export const isPositiveNumber = (number: number): boolean => Math.sign(number) === 1;

export const toMoney = (amount: string | number, currency: string): string => `${amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${currency} `;

export const orderByDate = <T extends { date: string }>(array: T[]): T[] => array.sort((a, b) => {
    const current = new Date(b.date).getTime();
    const next = new Date(a.date).getTime();

    return current - next;
});
