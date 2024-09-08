import React from 'react';
import styles from './Button.module.css';

export default function Button({ handleClick, style, children }) {
    return (
        <button onClick={handleClick} className={`${styles.button} ${[style]}`}>
            {children}
        </button>
    );
}
