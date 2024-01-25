"use client";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { formatCurrency } from "@expensestracker/utils/currency";
import ExpenseItem from "./ExpenseItem";
import IncomeModal from "./modals/IncomeModal";
import { useFinanceContext } from "../lib/context/financeContext";
import ExpensesModal from "./modals/ExpensesModal";
import { ExpensesType } from "@expensestracker/utils/types";
import ViewExpenseModal from "./modals/ViewExpenseModal";
import { useAuthContext } from "../lib/context/authContext";
import PageLoader from "./loaders/PageLoader";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { loading } = useAuthContext();
  const { expenses, incomeHistory, loadingExpenses } = useFinanceContext();

  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expensesModalOpen, setExpensesModalOpen] = useState(false);
  const [viewExpenseModalOpen, setViewExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpensesType>();

  const [balance, setBalance] = useState(0);

  const handleExpenseItemClick = (expense: ExpensesType) => {
    setSelectedExpense(expense);
    setViewExpenseModalOpen(true);
  };

  useEffect(() => {
    const tempBalance =
      incomeHistory.reduce((total, income) => total + income.amount, 0) - expenses.reduce((total, expense) => total + expense.total, 0);
    setBalance(tempBalance);
  }, [expenses, incomeHistory]);

  if (loading || loadingExpenses) {
    return <PageLoader />;
  }
  return (
    <main className="container max-w-2xl px-6 mx-auto">
      <section className="py-3">
        <small className="text-gray-400 text-md">My Balance</small>
        <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
      </section>
      <section className="flex items-center gap-2 py-3">
        <button className="btn btn-primary" onClick={() => setExpensesModalOpen(true)}>
          + Expenses
        </button>
        <button className="btn btn-primary-outline" onClick={() => setIncomeModalOpen(true)}>
          + Income
        </button>
      </section>

      <section className="py-6">
        <h3>My Expenses</h3>
        <div className="flex flex-col gap-4 mt-6">
          {expenses.length ? (
            expenses.map(item => (
              <button key={item.id} className="overflow-hidden rounded-3xl" onClick={() => handleExpenseItemClick(item)}>
                <ExpenseItem title={item.title} total={item.total} color={item.color} />
              </button>
            ))
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-center mt-10">No expenses yet!</h1>
              <h3 className="text-lg text-center text-slate-400">
                You can add expenses buy clicking on the{" "}
                <button onClick={() => setExpensesModalOpen(true)} className="dark:text-lime-400 text-[#1877F2]">
                  Expenses
                </button>{" "}
                button...
              </h3>
            </div>
          )}
        </div>
      </section>
      <section className="py-6">
        {expenses.length ? <h3 className="text-2xl">Stats</h3> : <></>}
        <div className="w-1/2 mx-auto">
          <Doughnut
            data={{
              labels: expenses.map(el => el.title),
              datasets: [
                {
                  label: "Expenses",
                  data: expenses.map(el => el.total),
                  backgroundColor: expenses.map(el => el.color),
                  borderColor: "none",
                  offset: 5,
                  hoverOffset: 50,
                  borderWidth: 2,
                  borderRadius: 2,
                },
              ],
            }}
          />
        </div>
      </section>
      <IncomeModal open={incomeModalOpen} setOpen={setIncomeModalOpen} />
      <ExpensesModal open={expensesModalOpen} setOpen={setExpensesModalOpen} />
      <ViewExpenseModal open={viewExpenseModalOpen} setOpen={setViewExpenseModalOpen} expense={selectedExpense} />
    </main>
  );
};

export default Dashboard;
