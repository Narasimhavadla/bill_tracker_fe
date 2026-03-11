import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileInvoice, faBoxesPacking, faCheckDouble, 
  faCalendarAlt, faFileExcel, faUserCircle 
} from '@fortawesome/free-solid-svg-icons';

const EmployeePerformance = () => {
  // Default to current month (YYYY-MM format)
  const [selectedMonth, setSelectedMonth] = useState("2026-03");

  // Mock data - in a real app, this would change based on selectedMonth
  const stats = [
    { title: 'Billed', value: 420, icon: faFileInvoice, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Picked', value: 385, icon: faBoxesPacking, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Verified', value: 310,  icon: faCheckDouble, color: 'text-[#81181C]', bg: 'bg-red-50' }
  ];

  const handleExport = () => {
    alert(`Downloading Excel report for ${selectedMonth}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <FontAwesomeIcon icon={faUserCircle} className="text-4xl text-slate-300" />
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Personal Stats</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: PM-4429</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Calendar Month Picker */}
          <div className="relative flex items-center bg-slate-100 rounded-xl px-4 py-2 border border-slate-200 hover:border-[#81181C] transition-all">
            {/* <FontAwesomeIcon icon={faCalendarAlt} className="text-[#81181C] mr-3" /> */}
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer uppercase"
            />
          </div>

          <button 
            onClick={handleExport}
            className="bg-[#81181C] text-white p-3 rounded-xl hover:bg-black transition-all shadow-md active:scale-95"
            title="Export to Excel"
          >
            <FontAwesomeIcon icon={faFileExcel} />
          </button>
        </div>
      </div>

      <p className="text-xs font-medium text-slate-400 mb-3">
            *Displaying data for the selected month.
      </p>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                
                <FontAwesomeIcon icon={stat.icon} /> 
            </div>
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{stat.title}</h3>
            
            
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Instruction Note */}
      <div className="mt-8 text-center">
        <p className="text-xs font-medium text-slate-400">
          *Select a different month above to view history.
        </p>
      </div>
    </div>
  );
};

export default EmployeePerformance;