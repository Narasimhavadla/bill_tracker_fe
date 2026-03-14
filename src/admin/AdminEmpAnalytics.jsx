import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileExcel, faStopwatch, faUserTie, faSearch, faFilter, faClock
} from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'sonner';

const EmployeePerformance = () => {
  const api = import.meta.env.VITE_API_BASE_URL;
  const [performanceData, setPerformanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // 'YYYY-MM'

  useEffect(() => {
    fetchPerformance();
  }, [currentMonth]);

  const fetchPerformance = async () => {
    try {
      const res = await axios.get(`${api}/performance/report?month=${currentMonth}`);
      setPerformanceData(res.data.data);
    } catch (error) {
      toast.error("Failed to load performance metrics");
    }
  };

  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleMasterExport = async (isLastMonth = false) => {
    let targetMonth = currentMonth;
    if (isLastMonth) {
      const date = new Date(currentMonth + '-01');
      date.setMonth(date.getMonth() - 1);
      targetMonth = date.toISOString().slice(0, 7);
    }

    toast.loading(`Exporting Master Data for ${targetMonth}...`);
    try {
      const res = await axios.get(`${api}/order/history`); // Existing history route
      // Filter history by month
      const filteredHistory = res.data.history.filter(h => h.completedAt.startsWith(targetMonth));
      exportToExcel(filteredHistory, `Master_Export_${targetMonth}`);
      toast.success("Master Sheet Downloaded");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleIndividualExport = async (emp) => {
    toast.loading(`Fetching work log for ${emp.name}...`);
    try {
      const res = await axios.get(`${api}/performance/worklog/${emp.empId}?month=${currentMonth}`);
      const logs = res.data.data.map(log => ({
        Bill_Num: log.billNum,
        Customer: log.customerName,
        Items: log.itemsCount,
        Role: log.pickerId === emp.empId ? "Picker" : "Verifier",
        Started: log.pickStartTime || log.verifyStartTime,
        Ended: log.pickEndTime || log.verifyEndTime,
        Duration_Secs: log.pickerId === emp.empId ? log.pickingDurationSecs : log.verifyDurationSecs
      }));
      exportToExcel(logs, `${emp.name}_Worklog_${currentMonth}`);
      toast.success(`Report for ${emp.name} ready`);
    } catch (error) {
      toast.error("Individual export failed");
    }
  };

  const filteredData = performanceData.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.empId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <Toaster position="top-center" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Performance <span className="text-[#81181C]">Audit</span>
          </h2>
          <p className="text-slate-500 font-medium">Month: {currentMonth}</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => handleMasterExport(true)}
            className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200"
          >
            <FontAwesomeIcon icon={faClock} /> Last Month
          </button>
          <button 
            onClick={() => handleMasterExport(false)}
            className="bg-[#81181C] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
          >
            <FontAwesomeIcon icon={faFileExcel} /> Export Master Sheet
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input 
            type="text"
            placeholder="Search staff..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <input 
          type="month" 
          value={currentMonth} 
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-[#81181C]"
        />
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Staff Member</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Efficiency Score</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Picked / Verified</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Avg Speed</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((emp) => (
              <tr key={emp.empId} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#81181C]">
                      <FontAwesomeIcon icon={faUserTie} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{emp.empId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-lg font-black text-[#81181C]">{emp.efficiency}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex gap-2 font-black">
                    <span className="text-slate-700">{emp.billsPicked}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-[#81181C]">{emp.billsVerified}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600">
                  <FontAwesomeIcon icon={faStopwatch} className="mr-2 opacity-30" />
                  {emp.avgSpeed}
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => handleIndividualExport(emp)}
                    className="text-[#81181C] border border-[#81181C]/20 px-4 py-2 rounded-lg text-xs font-black hover:bg-[#81181C] hover:text-white transition-all"
                  >
                    <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                    Work Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePerformance;