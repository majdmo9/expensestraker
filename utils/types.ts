export interface IncomeFormInputs {
  amount: number;
  description: string;
}
export interface ExpenseFormInputs {
  amount: number;
}

export interface AddCategoryFormInputs {
  color: string;
  title: string;
}

export type IncomeDataType = { uid: string; amount: number; description: string; createdAt: Date; id: string };
export type ExpensesType = {
  uid: string;
  id: string;
  color: string;
  title: string;
  total: number;
  items: { amount: number; createdAt: Date; id: string }[];
};
