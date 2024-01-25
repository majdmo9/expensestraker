import { Dispatch, SetStateAction } from "react";
import { Close } from "@mui/icons-material";

interface Props {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactElement;
}

const Modal = ({ modalOpen, setModalOpen, children }: Props) => {
  return (
    <div>
      <div
        id="modalOverlay"
        style={{ opacity: modalOpen ? 1 : 0, visibility: modalOpen ? "visible" : "hidden" }}
        className="fixed inset-0 bg-black bg-opacity-50 transition-all duration-700"
      />
      <div
        id="modalContainer"
        style={{ opacity: modalOpen ? 1 : 0, visibility: modalOpen ? "visible" : "hidden" }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-slate-800 bg-white max-w-xl w-full p-4 rounded-2xl dark:text-white text-black shadow-lg transition-all duration-700"
      >
        <div className="flex justify-end items-center">
          <button className="hover:text-gray-400 focus:outline-none text-xl" onClick={() => setModalOpen(false)}>
            <Close />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
