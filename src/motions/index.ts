import { Variants } from 'framer-motion';

const easing = [0.175, 0.85, 0.42, 0.96];

export const list: Variants = {
    visible: {
        transition: { staggerChildren: 0.07, delayChildren: 0.3 },
    },
    hidden: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

export const item: Variants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    hidden: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

export const text: Variants = {
    hidden: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
    visible: (delay?: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay: delay || 0.1, duration: 0.5, ease: easing },
    }),
};
