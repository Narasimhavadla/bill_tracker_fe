import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode, faUserCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "sonner";
import axios from "axios";

const AdminPicking = () => {

  const api = import.meta.env.VITE_API_BASE_URL

  const [formData, setFormData] = useState({
    billNumber: "",
    employeeNumber: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const billRef = useRef(null);
  const empRef = useRef(null);

  // Auto focus on bill field
  useEffect(() => {
    if (billRef.current) {
      billRef.current.focus();
    }
  }, []);

  // Move focus to employee field
  const handleKeyDownBill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!formData.billNumber) {
        toast.error("Bill Number is required!");
        return;
      }

      empRef.current.focus();
    }
  };

  // Submit when pressing enter in employee field
  const handleKeyDownEmp = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!formData.billNumber || !formData.employeeNumber) {
        toast.error("Both fields are required!");
        return;
      }

      document.getElementById("pickingForm").requestSubmit();
    }
  };

  // Submit picking request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const response = await axios.post(
        `${api}/order/scan/pick`,
        {
          billNum: formData.billNumber,
          empId: formData.employeeNumber
        }
      );

      toast.success(response.data.message || "Picking started successfully!");

      // Reset form
      setFormData({
        billNumber: "",
        employeeNumber: ""
      });

      // Focus back to bill field
      if (billRef.current) {
        billRef.current.focus();
      }

    } catch (error) {

      console.error("API Error:", error);

      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server connection error!");
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">

      <Toaster position="bottom-right" richColors />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="bg-[#81181C] p-4 text-center">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <FontAwesomeIcon icon={faBarcode} className="text-white text-2xl" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Picking Verification
          </h2>

          <p className="text-white/70 text-sm mt-1">
            Pharma Logistics & Order Fulfillment
          </p>

        </div>

        {/* Form */}
        <form
          id="pickingForm"
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* Bill Number */}
          <div>

            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Bill / Invoice Number
            </label>

            <div className="relative group">

              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#81181C] transition-colors">
                <FontAwesomeIcon icon={faBarcode} />
              </span>

              <input
                ref={billRef}
                required
                type="text"
                placeholder="Scan / Enter Bill Number"
                className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none transition-all text-slate-700 font-medium"
                value={formData.billNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billNumber: e.target.value
                  })
                }
                onKeyDown={handleKeyDownBill}
              />

            </div>

          </div>

          {/* Employee Number */}
          <div>

            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Picking Personnel ID
            </label>

            <div className="relative group">

              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#81181C] transition-colors">
                <FontAwesomeIcon icon={faUserCheck} />
              </span>

              <input
                ref={empRef}
                required
                type="text"
                placeholder="Scan / Enter Employee ID"
                className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none transition-all text-slate-700 font-medium"
                value={formData.employeeNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employeeNumber: e.target.value
                  })
                }
                onKeyDown={handleKeyDownEmp}
              />

            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
              isSubmitting
                ? "bg-slate-400"
                : "bg-[#81181C] hover:bg-[#6a1317]"
            }`}
          >

            {isSubmitting ? (
              <span className="animate-pulse">Starting Picking...</span>
            ) : (
              <>
                <span>Confirm & Start Picking</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </>
            )}

          </button>

        </form>

        {/* Footer */}
        <div className="px-8 py-2 bg-slate-50 border-t border-slate-100 text-center">

          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-tighter">
            Authorized Personnel Access Only • MediSYS Logistics
          </p>

        </div>

      </div>

    </div>
  );
};

export default AdminPicking;