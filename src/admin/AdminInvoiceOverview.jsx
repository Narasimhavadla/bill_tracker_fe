import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFileInvoice, faBoxesPacking, 
  faCheckDouble, faClock, faUserCircle, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

const BillStatusOverview = () => {

const api = import.meta.env.VITE_API_BASE_URL

  const [billNumber, setBillNumber] = useState('');
  const [data, setData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!billNumber.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Calling your specific drill-down API
      const response = await axios.get(`${api}/order/history/${billNumber}`);
      const resData = response.data;

      // Formatting backend data for the UI
      if (resData.success) {
        const { billedRecord, pickingRecord, verifyRecord, historyRecord } = resData;
        
        setData({
          id: billNumber,
          customer: billedRecord?.customerName || historyRecord?.customerName || "Unknown Customer",
          status: historyRecord?.status || "In Progress",
          // Mapping records to cards
          billing: {
            name: billedRecord?.empName || "System",
            time: billedRecord ? new Date(billedRecord.billedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--",
            date: billedRecord ? new Date(billedRecord.billedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ""
          },
          picking: {
            name: pickingRecord?.empName || "Pending",
            time: pickingRecord ? new Date(pickingRecord.pickStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--",
            date: pickingRecord ? new Date(pickingRecord.pickStartTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "",
            duration: pickingRecord?.pickingDurationSecs 
          },
          verifying: {
            name: verifyRecord?.empName || "Pending",
            time: verifyRecord ? new Date(verifyRecord.verifyStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--",
            date: verifyRecord ? new Date(verifyRecord.verifyStartTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "",
            duration: verifyRecord?.verifyDurationSecs
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Bill not found in history");
      setData(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Search Section */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Enter Bill Number (e.g. BILL-101)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none font-bold text-slate-700"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={isSearching}
          className="w-full md:w-auto bg-[#81181C] text-white px-10 py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-70"
        >
          {isSearching ? 'Searching...' : 'Track Bill'}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 font-bold animate-pulse">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {error}
        </div>
      )}

      {data ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#81181C] text-white rounded-2xl">
                  <FontAwesomeIcon icon={faFileInvoice} size="lg" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase">{data.id}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{data.customer}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-4 py-1 rounded-lg text-xs font-black uppercase ${data.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {data.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailCard title="Billing" name={data.billing.name} time={data.billing.time} date={data.billing.date} icon={faUserCircle} />
            <DetailCard title="Picking" name={data.picking.name} time={data.picking.time} date={data.picking.date} icon={faBoxesPacking} duration={data.picking.duration} highlight />
            <DetailCard title="Verification" name={data.verifying.name} time={data.verifying.time} date={data.verifying.date} icon={faCheckDouble} duration={data.verifying.duration} />
          </div>
        </div>
      ) : !isSearching && (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
           <FontAwesomeIcon icon={faFileInvoice} className="text-slate-100 text-6xl mb-4" />
           <h3 className="text-slate-400 font-bold text-lg">Enter a Bill Number to see the full audit trail</h3>
        </div>
      )}
    </div>
  );
};

const DetailCard = ({ title, name, time, date, icon, highlight, duration }) => (
  <div className={`p-6 rounded-3xl transition-all hover:shadow-xl border ${highlight ? 'bg-white ring-4 ring-[#81181C]/5 border-[#81181C]/20' : 'bg-white border-slate-100'}`}>
    <div className='flex justify-between items-start mb-4'>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#81181C]">{title}</p>
        {duration && (
          <span className='text-[10px] bg-orange-100 px-2 py-0.5 rounded-md text-orange-700 font-black border border-orange-200'>
            {Math.floor(duration / 60)}m {duration % 60}s
          </span>
        )}
    </div>
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${highlight ? 'bg-[#81181C] text-white' : 'bg-slate-100 text-slate-400'}`}>
        <FontAwesomeIcon icon={icon} size="lg" />
      </div>
      <div className="overflow-hidden">
        <h4 className="font-bold text-slate-800 truncate">{name}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase">Authorized Staff</p>
      </div>
    </div>
    <div className="flex items-center justify-between text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div className="flex items-center gap-2 text-xs font-bold">
        <FontAwesomeIcon icon={faClock} className="text-[#81181C]" />
        {time}
      </div>
      <div className="text-[10px] font-black uppercase text-slate-400">{date}</div>
    </div>
  </div>
);

export default BillStatusOverview;