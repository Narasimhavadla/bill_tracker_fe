import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faBoxOpen, faCheckCircle, 
  faUsers, faArrowTrendUp, faClock, 
  faExclamationTriangle, faFileDownload, 
  faBoxesPacking, faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { faBilibili } from '@fortawesome/free-brands-svg-icons';

const AdminAnalytics = () => {
  
  // Mock Data for the Dashboard
  const stats = [
    { title: 'Total Picked', value: '12,840', icon: faBoxOpen },
    { title: 'Billed Today', value: '840', icon: faClock },
    { title: 'Picked Today', value: '1,002', icon: faBoxesPacking },
    { title: 'Verified Today', value: '842', icon: faCheckCircle },
    { title: 'Active Staff', value: '24',  icon: faUsers },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* Header with Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Operational <span className="text-[#81181C]">Analytics</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm">Real-time pharmaceutical logistics and performance tracking.</p>
        </div>
        
        <button 
          onClick={() => toast.success("Generating PDF Report...")}
          className="flex items-center gap-2 bg-white border-2 border-[#81181C] hover:border-black text-[#81181C] px-5 py-2.5 rounded-xl font-bold hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <FontAwesomeIcon icon={faFileDownload} />
          Export Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-[#81181C] rounded-xl group-hover:bg-[#81181C] group-hover:text-white transition-colors">
                <FontAwesomeIcon icon={item.icon} size="lg" />
              </div>
            </div>
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{item.title}</h4>
            <div className="text-2xl font-black text-slate-800 mt-1 tracking-tight">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Performance Graph Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-[#81181C]" />
              Picking Efficiency (24h)
            </h3>
            <select className="bg-slate-50 border border-slate-200 text-[10px] font-black p-2 rounded-lg outline-none uppercase tracking-widest cursor-pointer">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          {/* Visual Placeholder for Graph */}
          <div className="h-64 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#81181C]/5 to-transparent"></div>
             <FontAwesomeIcon icon={faArrowTrendUp} className="text-[#81181C]/10 text-7xl mb-4 group-hover:scale-110 transition-transform duration-500" />
             <p className="text-slate-400 font-black text-xs tracking-widest uppercase">Streaming Real-time Data...</p>
          </div>
        </div>

        {/* Workload Distribution Pie Chart Placeholder */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8">
            <FontAwesomeIcon icon={faChartPie} className="text-[#81181C]" />
            Workload Distribution
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Pie Chart Visual Placeholder */}
            <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center">
              {/* Colored Segments (Mockup) */}
              <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-[#81181C] border-r-[#81181C]/40 -rotate-45"></div>
              
              <div className="text-center">
                <span className="block text-3xl font-black text-slate-800">82%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#81181C]"></div>
                  <span className="text-xs font-bold text-slate-600">Picking</span>
                </div>
                <span className="text-xs font-black text-slate-800">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#81181C]/40"></div>
                  <span className="text-xs font-bold text-slate-600">Verifying</span>
                </div>
                <span className="text-xs font-black text-slate-800">37%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-600">Pending</span>
                </div>
                <span className="text-xs font-black text-slate-800">18%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;