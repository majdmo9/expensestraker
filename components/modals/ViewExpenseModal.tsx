import { format } from "date-fns";
import { toast } from "react-toastify";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

import { ExpensesType } from "@expensestracker/utils/types";
import { formatCurrency } from "@expensestracker/utils/currency";
import { DateStringFormat } from "@expensestracker/utils/constants";
import { ModalProps } from "./types";
import Modal from "./Modal";
import { useFinanceContext } from "../../lib/context/financeContext";
import { useState } from "react";
import MediumLoader from "../loaders/MediumLoader";
import SmallLoader from "../loaders/SmallLoader";

interface Props extends ModalProps {
  expense?: ExpensesType;
}

const ViewExpenseModal = ({ open, setOpen, expense }: Props) => {
  const { deleteExpenseItem, deleteExpenseCategory } = useFinanceContext();
  const [loading, setLoading] = useState<string | boolean>(false);

  const handleDeleteExpenseItem = async (item: ExpensesType["items"][0]) => {
    if (!expense) return;
    try {
      setLoading(item.id);
      const filteredItems = expense?.items.filter(el => el.id !== item.id);
      const updatedExpense: Pick<ExpensesType, "items" | "total"> = {
        items: [...(filteredItems as ExpensesType["items"])],
        total: (expense?.total ?? 0) - item.amount,
      };
      await deleteExpenseItem(updatedExpense, expense.id);
      setLoading(false);
      toast.success("Expense Deleted!");
    } catch (err: any) {
      console.log({ err });
      toast.error(err.message);
    }
  };

  const handleDeleteCategory = async () => {
    if (!expense) return;
    try {
      setLoading(true);
      await deleteExpenseCategory(expense.id);
      setLoading(false);
      setOpen(false);
      toast.success("Category Deleted!");
    } catch (err: any) {
      console.log({ err });
      toast.error(err.message);
    }
  };

  if (!expense || !expense?.items) {
    return <></>;
  }
  return (
    <Modal modalOpen={open} setModalOpen={setOpen}>
      <>
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-4xl">{expense.title}</h2>
          <button className="btn btn-danger flex items-center gap-2" onClick={handleDeleteCategory}>
            Delete {loading === true ? <MediumLoader /> : <></>}
          </button>
        </div>
        <div>
          {expense.items.length ? <h3 className="my-4 text-2xl">Expense History</h3> : <></>}
          {expense.items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <small>{format(item.createdAt.toISOString(), DateStringFormat)}</small>
              <p className="flex items-center gap-2">
                {formatCurrency(item.amount)}
                <button onClick={() => handleDeleteExpenseItem(item)}>{loading === item.id ? <SmallLoader /> : <DeleteForeverRoundedIcon />}</button>
              </p>
            </div>
          ))}
        </div>
      </>
    </Modal>
  );
};

export default ViewExpenseModal;
