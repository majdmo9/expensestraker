import { formatCurrency } from "@expensestracker/utils/currency";
import React from "react";

interface Props {
  title: string;
  total: number;
  color: string;
}

const ExpenseItem = ({ title, total, color }: Props) => {
  return (
    <div className="w-full flex items-center justify-between p-4 bg-[#1877f2] text-white dark:bg-slate-700">
      <div className="flex items-center gap-2">
        <div className="w-[25px] h-[25px] rounded-full border border-white" style={{ background: color }} />
        <h4 className="capitalize">{title}</h4>
      </div>
      {total ? <p>{formatCurrency(total)}</p> : <></>}
    </div>
  );
};

export default ExpenseItem;
