import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

import { IncomeFormInputs } from "@expensestracker/utils/types";
import { formatCurrency } from "@expensestracker/utils/currency";

import Modal from "./Modal";
import { useFinanceContext } from "../../lib/context/financeContext";
import { ModalProps } from "./types";
import MediumLoader from "../loaders/MediumLoader";
import SmallLoader from "../loaders/SmallLoader";

const IncomeModal = ({ open, setOpen }: ModalProps) => {
  const { register, handleSubmit, reset } = useForm<IncomeFormInputs>();
  const { incomeHistory, addIncomeItem, removeIncomeItem } = useFinanceContext();
  const [loading, setLoading] = useState<string | boolean>(false);

  const addIncomeHandler = async (values: IncomeFormInputs) => {
    try {
      setLoading(true);
      await addIncomeItem(values);
      reset();
      toast.success("Entry Added!");
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRemoveIncome = async (incomeId: string) => {
    try {
      setLoading(incomeId);
      await removeIncomeItem(incomeId);
      toast.success("Income Removed");
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Modal modalOpen={open} setModalOpen={setOpen}>
      <div className="min-w-full">
        <form onSubmit={handleSubmit(addIncomeHandler)} className="input-group">
          <div className="input-group">
            <label htmlFor="amount">Income Amount</label>
            <input type="number" min={0.01} step={0.01} placeholder="Enter income amount" {...register("amount")} required />
          </div>
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <input required type="text" placeholder="Enter Description" {...register("description")} />
          </div>
          <div className="w-full flex items-center justify-center">
            <button className="btn btn-primary flex items-center gap-2" type="submit">
              Add entry {loading === true ? <MediumLoader /> : <></>}
            </button>
          </div>
        </form>
        <div className="input-group mt-6 w-full">
          <h3 className="text-2xl font-bold">Income History</h3>
          {incomeHistory.map(el => (
            <div key={el.id} className="flex justify-between itemms-center">
              <div>
                <p className="font-semibold">{el.description}</p>
                <small className="text-xs">{el.createdAt.toISOString()}</small>
              </div>
              <p className="flex items-center gap-2">
                {formatCurrency(el.amount)}
                <button onClick={() => handleRemoveIncome(el.id)}>{loading === el.id ? <SmallLoader /> : <DeleteForeverRoundedIcon />}</button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default IncomeModal;
