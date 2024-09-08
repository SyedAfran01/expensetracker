import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import styles from './ExpenseForm.module.css';

export default function ExpenseForm({ setIsOpen, expenseList, setExpenseList, setBalance, editId, balance }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [date, setDate] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (editId) {
            const expense = expenseList.find(exp => exp.id === editId);
            if (expense) {
                setTitle(expense.title);
                setAmount(expense.price);
                setCategory(expense.category);
                setDate(expense.date);
            }
        }
    }, [editId, expenseList]);

    const handleSubmit = () => {
        const value = Number(amount);
        if (!title || isNaN(value) || value <= 0 || !date) {
            enqueueSnackbar('Please fill out all fields correctly.', { variant: 'error' });
            return;
        }
        if (value > balance) {
            enqueueSnackbar('Insufficient balance.', { variant: 'error' });
            return;
        }

        if (editId) {
            setExpenseList(prevList =>
                prevList.map(exp => 
                    exp.id === editId ? { ...exp, title, price: value, category, date } : exp
                )
            );
        } else {
            const newExpense = {
                id: Date.now(),
                title,
                price: value,
                category,
                date,
            };
            setExpenseList(prevList => [...prevList, newExpense]);
            setBalance(prevBalance => prevBalance - value);
        }
        localStorage.setItem("expenses", JSON.stringify(expenseList));
        setIsOpen(false);
    };

    return (
        <div className={styles.formContainer}>
            <h2>{editId ? 'Edit Expense' : 'Add Expense'}</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className={styles.input}
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className={styles.input}
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
            >
                <option value="food">Food</option>
                <option value="entertainment">Entertainment</option>
                <option value="travel">Travel</option>
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.button}>Submit</button>
            <button onClick={() => setIsOpen(false)} className={styles.button}>Cancel</button>
        </div>
    );
}
