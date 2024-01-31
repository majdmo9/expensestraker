import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { ModalProps } from "../types";
import { ExpenseFormInputs } from "@expensestracker/utils/types";
import { useFinanceContext } from "../../../lib/context/financeContext";
import ExpenseItem from "../../ExpenseItem";
import Modal from "../Modal";
import AddCategoryForm from "./AddCategoryForm";
import MediumLoader from "@expensestracker/components/loaders/MediumLoader";
import { toast } from "react-toastify";
import { Collapse } from "@mui/material";

const ExpensesModal = ({ open, setOpen }: ModalProps) => {
  const { register, handleSubmit, reset, watch } = useForm<ExpenseFormInputs>();
  const expenseAmount = watch("amount");
  const { expenses, addExpenseItem } = useFinanceContext();

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [loading, setLoading] = useState(false);

  const addExpense = async (values: ExpenseFormInputs) => {
    if (!selectedCategory) return;
    try {
      setLoading(true);
      await addExpenseItem(values, selectedCategory);
      reset();
      setShowAddCategory(false);
      setLoading(false);
      setOpen(false);
      toast.success("Expense Added!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Modal modalOpen={open} setModalOpen={setOpen}>
      <div className="input-group">
        <div className="flex justify-between items-center collapse-title">
          <button
            className={showAddCategory ? "text-red-500" : "dark:text-emerald-400 text-[#1877f2]"}
            onClick={() => setShowAddCategory(prev => !prev)}
          >
            {showAddCategory ? "Close" : "+ New Category"}
          </button>
        </div>
        <Collapse in={showAddCategory}>
          <div className="collapse-content">
            <AddCategoryForm />
          </div>
        </Collapse>

        <form
          className="flex flex-col gap-2"
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(addExpense)();
          }}
        >
          <label htmlFor="amount">Expense Amount</label>
          <input type="number" min={0.01} step={0.01} placeholder="Enter expense amount" {...register("amount")} />

          {expenseAmount ? (
            <>
              <h3 className="text-2xl capitalize">Select expense category</h3>
              <div className="flex flex-col gap-2">
                {expenses.map(expense => (
                  <button
                    key={expense.id}
                    className={
                      selectedCategory === expense.id
                        ? "w-full border border-slate-400 border-2 dark:border-white rounded-3xl overflow-hidden"
                        : "w-full rounded-3xl overflow-hidden"
                    }
                    onClick={() => setSelectedCategory(expense.id)}
                    type="button"
                  >
                    <ExpenseItem title={expense.title} color={expense.color} total={0} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
          {expenseAmount && selectedCategory ? (
            <button type="submit" className="btn btn-primary w-fit self-center flex items-center gap-2">
              Add Expense {loading ? <MediumLoader /> : <></>}
            </button>
          ) : (
            <></>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default ExpensesModal;
