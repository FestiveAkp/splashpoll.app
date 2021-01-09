import React from 'react';
import { motion } from 'framer-motion'

export default function HomepageAnimateOpen(props) {
    const { isOpen } = props;

    const variants = {
        open: {
            opacity: 1,
            y: "0%",
            height: 'auto',
            marginTop: '2rem',
            marginBottom: '2.5rem',
            pointerEvents: 'auto',
            transition: { type: 'tween' }
        },
        closed: {
            opacity: 0,
            y: "0%",
            height: 0,
            marginTop: '1rem',
            marginBottom: '1rem',
            pointerEvents: 'none',
            transition: { type: 'tween' }
        }
    };

    return (
        <motion.section
            animate={isOpen ? 'open' : 'closed'}
            initial="open"
            variants={variants}
        >
            {props.children}
        </motion.section>
    );
}
