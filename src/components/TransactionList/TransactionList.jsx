import TransactionCard from "../TranscationCard/TransactionCard";
import styles from './TransactionList.module.css';
import Modal from '../Modal/Modal';
import ExpenseForm from '../Forms/ExpenseForm/ExpenseForm';
import Pagination from '../Pagination/Pagination';
import { useEffect, useState } from "react";

export default function TransactionList({ transactions, title, editTransactions, balance, setBalance }) {
    const [editId, setEditId] = useState(0);
    const [isDisplayEditor, setIsDisplayEditor] = useState(false);
    const [currentTransactions, setCurrentTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage
    const maxRecords = 3;
    const [totalPages, setTotalPages] = useState(0);

    const handleDelete = (id) => {
        const item = transactions.find(i => i.id === id);
        const price = Number(item.price);
        setBalance(prev => prev + price);

        editTransactions(prev => (
            prev.filter(item => item.id !== id)
        ));
    };

    const handleEdit = (id) => {
        setEditId(id);
        setIsDisplayEditor(true);
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * maxRecords;
        const endIndex = Math.min(currentPage * maxRecords, transactions.length);

        setCurrentTransactions([...transactions].slice(startIndex, endIndex));
        setTotalPages(Math.ceil(transactions.length / maxRecords));
    }, [currentPage, transactions]);

    useEffect(() => {
        if (totalPages < currentPage && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [totalPages, currentPage]);

    return (
        <div className={styles.transactionsWrapper}>
            {title && <h2>{title}</h2>}
            {transactions.length > 0 ? (
                <>
                    <div className={styles.list}>
                        {currentTransactions.map(transaction => (
                            <TransactionCard
                                details={transaction}
                                key={transaction.id}
                                handleDelete={() => handleDelete(transaction.id)}
                                handleEdit={() => handleEdit(transaction.id)}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination 
                            updatePage={setCurrentPage} 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                        />
                    )}
                </>
            ) : (
                <div className={styles.emptyTransactionsWrapper}>
                    <p>No Transactions!</p>
                </div>
            )}

            <Modal isOpen={isDisplayEditor} setIsOpen={setIsDisplayEditor}>
                <ExpenseForm
                    editId={editId}
                    expensesList={transactions}  // Corrected prop name
                    setExpenseList={editTransactions}
                    setIsOpen={setIsDisplayEditor}
                    balance={balance}
                    setBalance={setBalance}
                />
            </Modal>
        </div>
    );
}
