import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileInvoice, 
  faUserCheck, 
  faArrowRight, 
  faUser, 
  faPhone,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

const AdminBilling = () => {
  const [formData, setFormData] = useState({
    billNumber: '',
    employeeNumber: '',
    customerName: '',
    customerPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Current ISO String for timestamps
    const now = new Date().toISOString();

   

    try {

        const payload = {
        billNumber: formData.billNumber,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        billingEmployeeId: formData.employeeNumber, 
        status: 'billed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
        };

      await axios.post("http://localhost:3000/live-orders", payload);
      
      toast.success(`Invoice #${formData.billNumber} synchronized successfully!`, {
        style: { backgroundColor: 'white', color: '#81181C' }
      });
      
      // Reset form
      setFormData({ 
        billNumber: '', 
        employeeNumber: '', 
        customerName: '', 
        customerPhone: '' 
      });
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Network Error: Could not reach Live Orders server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Toaster position="bottom-right" richColors />
      
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header Section */}
        <div className="bg-[#81181C] p-4 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-3">
            <FontAwesomeIcon icon={faFileInvoice} className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Billing Verification</h2>
          <p className="text-white/70 text-sm mt-1 uppercase tracking-widest font-medium italic">
            Live Order Entry
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            

            {/* Bill Number */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Bill / Invoice Number
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#81181C] transition-colors">
                  <FontAwesomeIcon icon={faFileInvoice} />
                </span>
                <input
                  required
                  type="text"
                  placeholder="INV-102030"
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] focus:bg-white outline-none transition-all text-slate-700 font-medium"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                />
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Customer Name
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#81181C] transition-colors">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  required
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] focus:bg-white outline-none transition-all text-slate-700 font-medium"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Customer Phone
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#81181C] transition-colors">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <input
                  required
                  type="tel"
                  placeholder="10-Digit Mobile"
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] focus:bg-white outline-none transition-all text-slate-700 font-medium"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Employee ID (Biller)
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#81181C] transition-colors">
                  <FontAwesomeIcon icon={faUserCheck} />
                </span>
                <input
                  required
                  type="text"
                  placeholder="Enter Staff ID"
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] focus:bg-white outline-none transition-all text-slate-700 font-medium"
                  value={formData.employeeNumber}
                  onChange={(e) => setFormData({...formData, employeeNumber: e.target.value})}
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
              isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#81181C] hover:bg-black shadow-red-900/20'
            }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} /> Syncing Data...
              </span>
            ) : (
              <>
                <span>Generate & Sync Bill</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="px-8 py-1 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-tighter">
            Authorized Personnel Access Only • MediSYS 
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;