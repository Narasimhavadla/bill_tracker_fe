import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, faFileExcel, faChartBar, 
  faStopwatch, faCheckDouble, faUserTie,
  faSearch, faFilter,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'sonner';

const EmployeePerformance = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Performance Data
  const performanceData = [
    { id: 'E001', name: 'John Doe', itemsPicked: 1240, itemsVerified: 1180, accuracy: '99.2%', avgSpeed: '45s', score: 98 },
    { id: 'E002', name: 'Jane Smith', itemsPicked: 1450, itemsVerified: 1420, accuracy: '98.5%', avgSpeed: '38s', score: 96 },
    { id: 'E004', name: 'Narasimha', itemsPicked: 980, itemsVerified: 950, accuracy: '97.8%', avgSpeed: '52s', score: 89 },
    { id: 'E003', name: 'Robert Fox', itemsPicked: 1100, itemsVerified: 1050, accuracy: '96.4%', avgSpeed: '48s', score: 85 },
  ];

  const handleExportExcel = (employeeName) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Compiling productivity manifest for ${employeeName}...`,
      success: `Excel Report for ${employeeName} downloaded.`,
      error: 'Export failed. Please check system logs.',
    });
  };

  const filteredData = performanceData.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <Toaster position="top-center" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Performance <span className="text-[#81181C]">Audit</span>
          </h2>
          <p className="text-slate-500 font-medium">Evaluate individual staff productivity and accuracy metrics.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
            <FontAwesomeIcon icon={faClock} />
            Past Month
          </button>
          <button className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
            <FontAwesomeIcon icon={faFilter} />
            This Month
          </button>
          <button 
            onClick={() => handleExportExcel('All Personnel')}
            className="bg-[#81181C] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 hover:bg-black transition-all"
          >
            <FontAwesomeIcon icon={faFileExcel} />
            Export Master Sheet
          </button>
        </div>
      </div>

      {/* Top Performers Ribbon */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-around gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#81181C] text-white rounded-full flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#81181C] uppercase tracking-widest">Top Picker</p>
            <p className="text-lg font-bold text-slate-800">Jane Smith</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-red-200"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border-2 border-[#81181C] text-[#81181C] rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faCheckDouble} />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#81181C] uppercase tracking-widest">Accuracy King</p>
            <p className="text-lg font-bold text-slate-800">John Doe</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input 
          type="text"
          placeholder="Search staff by name or ID..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Staff Member</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Efficiency</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Picking / Verifying</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Avg. Cycle Time</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#81181C] font-bold">
                          <FontAwesomeIcon icon={faUserTie} />
                        </div>
                        {emp.score > 90 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-white">
                            ★
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="w-full max-w-[100px]">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-bold text-[#81181C]">{emp.accuracy}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#81181C] rounded-full transition-all duration-1000" 
                          style={{ width: emp.accuracy }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-sm font-black text-slate-700">{emp.itemsPicked}</span>
                      <span className="text-[10px] text-slate-300">/</span>
                      <span className="text-sm font-black text-[#81181C]">{emp.itemsVerified}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <FontAwesomeIcon icon={faStopwatch} className="text-[10px] text-slate-300" />
                      <span className="text-sm font-bold">{emp.avgSpeed}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleExportExcel(emp.name)}
                      className="text-[#81181C] hover:bg-[#81181C] hover:text-white px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2 ml-auto border border-[#81181C]/20"
                    >
                      <FontAwesomeIcon icon={faFileExcel} />
                      Export Work Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformance;