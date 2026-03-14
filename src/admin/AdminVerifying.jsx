import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faSearch,
  faUserShield,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "sonner";

const Verifying = () => {

  const api = import.meta.env.VITE_API_BASE_URL

  const [formData, setFormData] = useState({
    billNumber: "",
    verifierId: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const billRef = useRef(null);
  const verifierRef = useRef(null);

  // Auto focus first field
  useEffect(() => {
    billRef.current?.focus();
  }, []);

  // Move to verifier input
  const handleBillKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!formData.billNumber.trim()) {
        toast.error("Bill number required");
        return;
      }

      verifierRef.current.focus();
    }
  };

  // Submit verification
  const handleVerifierKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!formData.verifierId.trim()) {
        toast.error("Verifier ID required");
        return;
      }

      handleVerify();
    }
  };

  const handleVerify = async () => {
    if (!formData.billNumber || !formData.verifierId) {
      toast.error("Please fill all fields");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(
        `${api}/order/scan/verify`,
        {
          billNum: formData.billNumber,
          empId: formData.verifierId,
        }
      );

      toast.success(
        response.data.message ||
          `Verification Complete for Bill #${formData.billNumber}`
      );

      // reset form
      setFormData({
        billNumber: "",
        verifierId: "",
      });

      // focus bill field again
      setTimeout(() => {
        billRef.current?.focus();
      }, 100);

    } catch (error) {
      console.error("Verification Error:", error);

      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server connection error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Toaster position="bottom-right" richColors />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

        {/* Header */}
        <div className="bg-[#81181C] p-4 text-center relative rounded-xl">

          <FontAwesomeIcon
            icon={faShieldAlt}
            className="absolute -right-6 -top-6 text-white/10 text-8xl rotate-12"
          />

          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3">
            <FontAwesomeIcon
              icon={faCheckDouble}
              className="text-[#81181C] text-2xl"
            />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Verification Counter
          </h2>

          <p className="text-white/70 text-sm">
            Final Check
          </p>

        </div>

        {/* Form */}
        <div className="p-6 space-y-5">

          {/* Bill Input */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Scan Bill Number
            </label>

            <div className="relative mt-1">

              <span className="absolute left-3 top-2 text-slate-400">
                <FontAwesomeIcon icon={faSearch} />
              </span>

              <input
                ref={billRef}
                type="text"
                placeholder="Scan / Enter Bill Num"
                value={formData.billNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billNumber: e.target.value,
                  })
                }
                onKeyDown={handleBillKey}
                className="w-full pl-10 pr-3 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#81181C] outline-none border-[#81181C]"
              />

            </div>
          </div>

          {/* Verifier Input */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Verifier ID
            </label>

            <div className="relative mt-1">

              <span className="absolute left-3 top-2 text-slate-400">
                <FontAwesomeIcon icon={faUserShield} />
              </span>

              <input
                ref={verifierRef}
                type="text"
                placeholder="Scan / Enter Emp ID"
                value={formData.verifierId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    verifierId: e.target.value,
                  })
                }
                onKeyDown={handleVerifierKey}
                className="w-full pl-10 pr-3 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#81181C] outline-none border-[#81181C]"
              />

            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleVerify}
            disabled={isProcessing}
            className={`w-full py-3 mt-4 rounded-xl font-bold text-white ${
              isProcessing ? "bg-gray-400" : "bg-[#81181C]"
            }`}
          >
            {isProcessing ? "Verifying..." : "Approve & Release"}
          </button>

        </div>

        {/* Footer */}
        <div className="px-6 py-2 bg-slate-50 text-center text-[9px] text-slate-400 uppercase mt-2">
          Authorized Personnel Access Only • MediSYS Logistics
        </div>

      </div>
    </div>
  );
};

export default Verifying;