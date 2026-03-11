import React from "react";
import axios from "axios";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTrashAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

export default function EmpDelete({ employeeId, onClose, onDeleted ,refresh}) {

  const confirmDelete = async () => {

    try {

      await axios.delete(
        `http://localhost:3000/api/v1/employees/${employeeId}`
      );

      refresh()
      toast.success("Employee deleted successfully");

      if (onDeleted) {
        onDeleted(employeeId); // remove from UI
      }

      onClose();

    } catch (error) {

      toast.error("Failed to delete employee");

    }

  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100">

        {/* Close */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#81181C]"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="px-8 pb-8">

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#81181C]/5 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-[#81181C] text-2xl"
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Confirm Delete
            </h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to remove this employee? This action will
              permanently revoke all system access.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">

            <button
              onClick={confirmDelete}
              className="w-full py-3 bg-[#81181C] hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faTrashAlt} size="sm" />
              Delete Permanently
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white text-slate-500 hover:text-slate-800 font-semibold rounded-xl"
            >
              Cancel
            </button>

          </div>

        </div>

        <div className="bg-[#81181C] h-1.5 w-full"></div>

      </div>

    </div>
  );
}