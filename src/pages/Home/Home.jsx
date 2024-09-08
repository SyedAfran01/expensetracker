import { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import styles from "./Home.module.css";
import TransactionList from "../../components/TransactionList/TransactionList";
import ExpenseForm from "../../components/Forms/ExpenseForm/ExpenseForm";
import Modal from "../../components/Modal/Modal";
import AddBalanceForm from "../../components/Forms/AddBalanceForm/AddBalanceForm";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Home() {
    const [balance, setBalance] = useState(0);
    const [expense, setExpense] = useState(0);
    const [expenseList, setExpenseList] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    const [isOpenExpense, setIsOpenExpense] = useState(false);
    const [isOpenBalance, setIsOpenBalance] = useState(false);

    const [categorySpends, setCategorySpends] = useState({
        food: 0,
        entertainment: 0,
        travel: 0,
    });

    const [categoryCount, setCategoryCount] = useState({
        food: 0,
        entertainment: 0,
        travel: 0,
    });

    useEffect(() => {
        const localBalance = localStorage.getItem("balance");

        if (localBalance) {
            setBalance(Number(localBalance));
        } else {
            setBalance(5000);
            localStorage.setItem("balance", 5000);
        }

        const item = JSON.parse(localStorage.getItem("expenses"));
        setExpenseList(item || []);
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (expenseList.length > 0 || isMounted) {
            localStorage.setItem("expenses", JSON.stringify(expenseList));
        }

        if (expenseList.length > 0) {
            setExpense(
                expenseList.reduce(
                    (accumulator, currenValue) =>
                        accumulator + Number(currenValue.price),
                    0
                )
            );
        } else {
            setExpense(0);
        }

        let foodSpends = 0, entertainmentSpends = 0, travelSpends = 0;
        let foodCount = 0, entertainmentCount = 0, travelCount = 0;

        expenseList.forEach((item) => {
            if (item.category === "food") {
                foodSpends += Number(item.price);
                foodCount++;
            } else if (item.category === "entertainment") {
                entertainmentSpends += Number(item.price);
                entertainmentCount++;
            } else if (item.category === "travel") {
                travelSpends += Number(item.price);
                travelCount++;
            }
        });

        setCategorySpends({
            food: foodSpends,
            travel: travelSpends,
            entertainment: entertainmentSpends,
        });

        setCategoryCount({
            food: foodCount,
            travel: travelCount,
            entertainment: entertainmentCount,
        });
    }, [expenseList, isMounted]);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("balance", balance);
        }
    }, [balance, isMounted]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Expense Tracker</h1>
            <div className={styles.cardsWrapper}>
                <Card
                    title="Wallet Balance"
                    money={balance}
                    buttonText="+ Add Income"
                    buttonType="success"
                    handleClick={() => {
                        setIsOpenBalance(true);
                    }}
                />

                <Card
                    title="Expenses"
                    money={expense}
                    buttonText="+ Add Expense"
                    buttonType="failure"
                    success={false}
                    handleClick={() => {
                        setIsOpenExpense(true);
                    }}
                />
                <PieChart width={400} height={300}>
                    <Pie
                        data={[
                            { name: "Food", value: categorySpends.food },
                            { name: "Entertainment", value: categorySpends.entertainment },
                            { name: "Travel", value: categorySpends.travel },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                    />
                    <Tooltip />
                </PieChart>
            </div>

            <div className={styles.transactionsWrapper}>
                <TransactionList
                    transactions={expenseList}
                    editTransactions={setExpenseList}
                    title="Recent Transactions"
                    balance={balance}
                    setBalance={setBalance}
                />

                <BarChart
                    width={500}
                    height={300}
                    data={[
                        { name: "Food", value: categorySpends.food },
                        { name: "Entertainment", value: categorySpends.entertainment },
                        { name: "Travel", value: categorySpends.travel },
                    ]}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </div>

            <div className={styles.categoryCounts}>
                <p>Food Transactions: {categoryCount.food}</p>
                <p>Entertainment Transactions: {categoryCount.entertainment}</p>
                <p>Travel Transactions: {categoryCount.travel}</p>
            </div>

            <Modal isOpen={isOpenExpense} setIsOpen={setIsOpenExpense}>
                <ExpenseForm
                    setIsOpen={setIsOpenExpense}
                    expenseList={expenseList}
                    setExpenseList={setExpenseList}
                    setBalance={setBalance}
                    balance={balance}
                />
            </Modal>

            <Modal isOpen={isOpenBalance} setIsOpen={setIsOpenBalance}>
                <AddBalanceForm setIsOpen={setIsOpenBalance} setBalance={setBalance} />
            </Modal>
        </div>
    );
}
