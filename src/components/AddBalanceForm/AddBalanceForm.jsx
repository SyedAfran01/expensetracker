import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import styles from './AddBalanceForm.module.css';

export default function AddBalanceForm({ setIsOpen, setBalance }) {
    const [amount, setAmount] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const handleAddBalance = () => {
        const value = Number(amount);
        if (isNaN(value) || value <= 0) {
            enqueueSnackbar('Invalid amount. Please enter a positive number.', { variant: 'error' });
            return;
        }
        setBalance(prevBalance => {
            const newBalance = prevBalance + value;
            localStorage.setItem("balance", newBalance);
            return newBalance; 
        });
        setIsOpen(false);
    };

    return (
        <div className={styles.formContainer}>
            <h2>Add Balance</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className={styles.input}
            />
            <button onClick={handleAddBalance} className={styles.button}>Add</button>
            <button onClick={() => setIsOpen(false)} className={styles.button}>Cancel</button>
        </div>
    );
}
