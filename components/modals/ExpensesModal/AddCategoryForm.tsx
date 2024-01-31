import { AddCategoryFormInputs } from "@expensestracker/utils/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFinanceContext } from "../../../lib/context/financeContext";
import { toast } from "react-toastify";
import MediumLoader from "@expensestracker/components/loaders/MediumLoader";

const AddCategoryForm = () => {
  const { register, handleSubmit, reset } = useForm<AddCategoryFormInputs>();
  const { addCategory } = useFinanceContext();

  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (values: AddCategoryFormInputs) => {
    try {
      setLoading(true);
      await addCategory(values);
      reset();
      toast.success("Categorey Created");
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddCategory)}>
      <div className="flex items-center justify-between gap-4">
        <input type="text" required placeholder="Category Title" {...register("title")} />
        <label htmlFor="color" className="text-nowrap">
          Pick Color
        </label>
        <input type="color" className="w-24 h-10" {...register("color")} />
        <button className="btn btn-primary flex items-center gap-2" type="submit">
          Create {loading ? <MediumLoader /> : <></>}
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;
