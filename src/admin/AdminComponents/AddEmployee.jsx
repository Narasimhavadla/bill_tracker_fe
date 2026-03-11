import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faUser, faIdBadge, 
  faPhone, faShieldAlt, faUserPlus 
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import axios from 'axios';

const AddEmployeeModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    empName: '',
    empId: '',
    phone: '',
    canPick: true,
    canVerify: true,
    // canBill : true
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.empName || !formData.empId || !formData.phone) {
      toast.error("Please fill in all required personnel fields.");
      return;
    }

    try {
      // API POST request
      const response = await axios.post("http://localhost:3000/api/v1/employees", formData);
      
      // Update the parent state with the new employee
      onAdd(response.data);
      
      toast.success(`${formData.empName} registered with custom access.`);
      
      // Reset form and close
      setFormData({ empName: '', empId: '', phone: '', canPick: true, canVerify: false });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Server Error: Could not save employee.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#81181C] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            <div>
              <h3 className="text-xl font-bold leading-none">Register Personnel</h3>
              <p className="text-white/60 text-xs mt-1 uppercase tracking-widest font-medium">Access Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform p-2">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          
          {/* Input: Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <FontAwesomeIcon icon={faUser} className="text-sm" />
              </span>
              <input 
                type="text"
                placeholder="Enter full name"
                className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none transition-all"
                value={formData.empName}
                onChange={(e) => setFormData({...formData, empName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input: Employee ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Staff ID</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <FontAwesomeIcon icon={faIdBadge} className="text-sm" />
                </span>
                <input 
                  type="text"
                  placeholder="EMP-000"
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none transition-all"
                  value={formData.empId}
                  onChange={(e) => setFormData({...formData, empId: e.target.value})}
                />
              </div>
            </div>

            {/* Input: Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Contact No.</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <FontAwesomeIcon icon={faPhone} className="text-sm" />
                </span>
                <input 
                  type="tel"
                  placeholder="10-digit number"
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <h4 className="text-[11px] font-black text-[#81181C] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} /> Module Authorization
            </h4>
            
            <div className="grid grid-cols-1 gap-3">

               {/* Toggle: Billing */}
              {/* <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${formData.canVerify ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Billing Module</p>
                  <p className="text-[10px] text-slate-500 font-medium">Allow user to Bill</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.canBill}
                    onChange={() => setFormData({...formData, canBill: !formData.canBill})}
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81181C]"></div>
                </label>
              </div> */}

              {/* Toggle: Picking */}
              <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${formData.canPick ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Picking Module</p>
                  <p className="text-[10px] text-slate-500 font-medium">Allow user to collect items from inventory</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.canPick}
                    onChange={() => setFormData({...formData, canPick: !formData.canPick})}
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81181C]"></div>
                </label>
              </div>

              {/* Toggle: Verifying */}
              <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${formData.canVerify ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Verifying Module</p>
                  <p className="text-[10px] text-slate-500 font-medium">Allow user to audit and approve batches</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.canVerify}
                    onChange={() => setFormData({...formData, canVerify: !formData.canVerify})}
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81181C]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] py-2 bg-[#81181C] text-white font-bold rounded-xl shadow-lg shadow-red-900/20 hover:bg-black transition-all active:scale-95"
            >
              Confirm Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;