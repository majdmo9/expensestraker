"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { v4 as uuidV4 } from "uuid";

import { AddCategoryFormInputs, ExpenseFormInputs, ExpensesType, IncomeDataType, IncomeFormInputs } from "@expensestracker/utils/types";
import { db } from "../firebase";
import { CollectionsEnum } from "../firebase/constants";
import { useAuthContext } from "./authContext";

const financeContext = createContext<{
  expenses: ExpensesType[];
  incomeHistory: IncomeDataType[];
  loadingExpenses: boolean;
  addIncomeItem: (values: IncomeFormInputs) => Promise<void>;
  removeIncomeItem: (id: string) => Promise<void>;
  addExpenseItem: (values: ExpenseFormInputs, category: string) => Promise<void>;
  addCategory: (category: AddCategoryFormInputs) => Promise<void>;
  deleteExpenseItem: (expense: Pick<ExpensesType, "items" | "total">, category: string) => Promise<void>;
  deleteExpenseCategory: (category: string) => Promise<void>;
}>({
  incomeHistory: [],
  expenses: [],
  loadingExpenses: false,
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
});

const FinanceContextProvider = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuthContext();

  const [incomeHistory, setIncomeHistory] = useState<IncomeDataType[]>([]);
  const [expenses, setExpenses] = useState<ExpensesType[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const addExpenseItem = async (values: ExpenseFormInputs, category: string) => {
    const expense = expenses.find(el => el.id === category);

    const newExpense: ExpensesType = {
      ...expense,
      total: (expense?.total ?? 0) + Number(values.amount),
      items: [...((expense?.items ?? []) as ExpensesType["items"]), { amount: Number(values.amount), createdAt: new Date(), id: uuidV4() }],
    } as ExpensesType;
    const docRef = doc(db, CollectionsEnum.EXPENSES, category);
    try {
      await updateDoc(docRef, { ...newExpense });
      setExpenses(prev => {
        const clonedExpenses = [...prev];
        const expenseIndex = prev.findIndex(el => el.id === category);
        clonedExpenses[expenseIndex] = newExpense;
        return clonedExpenses;
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const addCategory = async (category: AddCategoryFormInputs) => {
    if (!user) return;
    const collectionRef = collection(db, CollectionsEnum.EXPENSES);
    try {
      const docSnap = await addDoc(collectionRef, { uid: user.uid, ...category, items: [], total: 0 });
      setExpenses(prev => [...prev, { uid: user.uid, id: docSnap.id, ...category, total: 0 } as ExpensesType]);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const addIncomeItem = async (values: IncomeFormInputs) => {
    if (!user) return;
    const newIncome = { uid: user.uid, ...values, amount: Number(values.amount), createdAt: new Date() };
    const collectionRef = collection(db, CollectionsEnum.INCOME);
    try {
      const docSnap = await addDoc(collectionRef, newIncome);
      setIncomeHistory(prev => Array.from(new Set([...(prev as IncomeDataType[]), { id: docSnap.id, ...newIncome }])));
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const removeIncomeItem = async (id: string) => {
    const docRef = doc(db, CollectionsEnum.INCOME, id);
    try {
      await deleteDoc(docRef);
      setIncomeHistory(prev => prev?.filter(el => el.id !== id));
    } catch (err) {
      console.log({ err });
      throw err;
    }
  };

  const deleteExpenseItem = async (expense: Pick<ExpensesType, "items" | "total">, category: string) => {
    try {
      const docRef = doc(db, CollectionsEnum.EXPENSES, category);
      await updateDoc(docRef, { ...expense });
      setExpenses(prev => {
        const tempExpenses = [...prev];
        const expenseCategoryIdx = tempExpenses.findIndex(el => el.id === category);
        tempExpenses[expenseCategoryIdx].items = [...expense.items];
        tempExpenses[expenseCategoryIdx].total = expense.total;
        return tempExpenses;
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const deleteExpenseCategory = async (category: string) => {
    try {
      const docRef = doc(db, CollectionsEnum.EXPENSES, category);
      await deleteDoc(docRef);
      setExpenses(prev => prev.filter(el => el.id !== category));
    } catch (err) {
      console.log({ err });
      throw err;
    }
  };

  useEffect(() => {
    if (!user) return;

    const handleFetchIncome = async () => {
      const collectionRef = collection(db, CollectionsEnum.INCOME);
      const fetchQeury = query(collectionRef, where("uid", "==", user.uid));
      const docsSnap = await getDocs(fetchQeury);
      const data = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) }));
      setIncomeHistory(data as IncomeDataType[]);
    };
    const handleFetchExpenses = async () => {
      setLoadingExpenses(true);
      const collectionRef = collection(db, CollectionsEnum.EXPENSES);
      const fetchQeury = query(collectionRef, where("uid", "==", user.uid));
      const docsSnap = await getDocs(fetchQeury);
      const data = docsSnap.docs.map(el => ({
        id: el.id,
        ...el.data(),
        items: el.data().items.map((item: ExpensesType["items"][0]) => ({ ...item, createdAt: new Date((item.createdAt as any).toMillis()) })),
      }));
      setExpenses(data as ExpensesType[]);
      setLoadingExpenses(false);
    };
    handleFetchExpenses();
    handleFetchIncome();
  }, [user]);

  return (
    <financeContext.Provider
      value={{
        incomeHistory,
        expenses,
        loadingExpenses,
        addIncomeItem,
        removeIncomeItem,
        addExpenseItem,
        addCategory,
        deleteExpenseItem,
        deleteExpenseCategory,
      }}
    >
      {children}
    </financeContext.Provider>
  );
};

export default FinanceContextProvider;

export const useFinanceContext = () => useContext(financeContext);
