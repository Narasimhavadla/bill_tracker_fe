import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faUser, faIdBadge, 
  faPhone, faShieldAlt, faPen, faLock, faEye, faEyeSlash 
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import axios from 'axios';

const EditEmployeeModal = ({ isOpen, onClose, employee, onUpdate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    empName: '',
    empId: '',
    phone: '',
    password: '', 
    canPick: false,
    canVerify: false,
  });

  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (employee) {
      setFormData({
        empName: employee.empName || '',
        empId: employee.empId || '',
        phone: employee.phone || '',
        password: '', // Kept empty initially for security
        canPick: employee.canPick === 'true' || employee.canPick === true,
        canVerify: employee.canVerify === 'true' || employee.canVerify === true,
      });
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${api}/employees/${employee.id}`, formData);
      onUpdate(response.data.data);
      toast.success(`${formData.empName} updated successfully.`);
      onClose();
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#81181C] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg"><FontAwesomeIcon icon={faPen} /></div>
            <div>
              <h3 className="text-xl font-bold leading-none">Edit Employee</h3>
              <p className="text-white/60 text-[10px] mt-1 uppercase tracking-widest font-bold">Admin Management Console</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform p-2">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                </span>
                <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-[#81181C] outline-none transition-all" 
                  value={formData.empName} onChange={(e) => setFormData({...formData, empName: e.target.value})} />
              </div>
            </div>

            {/* Password Update Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-red-700 uppercase ml-1">Update Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <FontAwesomeIcon icon={faLock} className="text-xs" />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter new password"
                  className="w-full pl-11 pr-11 py-2.5 bg-red-50/30 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-[#81181C] outline-none transition-all" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#81181C]"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Staff ID</label>
              <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                value={formData.empId} onChange={(e) => setFormData({...formData, empId: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Contact No.</label>
              <input type="tel" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-[11px] font-black text-[#81181C] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} /> Authorization
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Custom Toggles */}
              {[ {key: 'canPick', label: 'Picking'}, {key: 'canVerify', label: 'Verifying'} ].map((item) => (
                <div key={item.key} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${formData[item.key] ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData[item.key]} 
                      onChange={() => setFormData({...formData, [item.key]: !formData[item.key]})} />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#81181C] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-[2] py-3 bg-[#81181C] text-white font-bold rounded-xl shadow-lg shadow-red-900/20 hover:bg-black transition-all active:scale-95">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;