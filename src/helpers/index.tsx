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

export const orderByDate = <T extends { date: string }>(array: T[]) => array.sort((a, b) => {
    const current = new Date(b.date).getTime();
    const next = new Date(a.date).getTime();

    return current - next;
})