import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFileInvoice, faBoxesPacking, 
  faCheckDouble, faClock, faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

const BillStatusOverview = () => {
  const [billNumber, setBillNumber] = useState('');
  const [data, setData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // The Submit Handler
  const handleSearch = (e) => {
    if (e) e.preventDefault(); // Prevents page refresh
    if (!billNumber.trim()) return;

    setIsSearching(true);

    // Simulating API Call
    setTimeout(() => {
      setData({
        id: billNumber,
        amount: "₹4,520.00",
        customer: "Apollo Pharmacy Store #4",
        status: "Verified",
        billing: { name: "Anjali Sharma", time: "10:15 AM", date: "Oct 12" },
        picking: { name: "Vikram Rathore", time: "10:42 AM", date: "Oct 12" },
        verifying: { name: "Suresh Iyer", time: "11:05 AM", date: "Oct 12" }
      });
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Search Section wrapped in a FORM */}
      <form 
        onSubmit={handleSearch} 
        className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div className="relative flex-1 w-full">
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search Invoice ID..."
            className="w-full pl-12 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#81181C] outline-none font-bold text-slate-700"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={isSearching}
          className="w-full md:w-auto bg-[#81181C] text-white px-10 py-2 rounded-xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-70"
        >
          {isSearching ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {data ? (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          {/* Top Status Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-4">
            <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#81181C] text-white rounded-2xl">
                  <FontAwesomeIcon icon={faFileInvoice} size="lg" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">{data.id}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{data.customer}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <div className="px-4 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-tighter">
                  {data.status}
                </div>
              </div>
            </div>
          </div>

          {/* Personnel Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailCard 
              title="Billing Done by" 
              name={data.billing.name} 
              time={data.billing.time} 
              date={data.billing.date}
              icon={faUserCircle}
            />
            <DetailCard 
              title="Picking Done by" 
              name={data.picking.name} 
              time={data.picking.time} 
              date={data.picking.date}
              icon={faBoxesPacking}
              highlight
            />
            <DetailCard 
              title="Checking Done by" 
              name={data.verifying.name} 
              time={data.verifying.time} 
              date={data.verifying.date}
              icon={faCheckDouble}
            />
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faFileInvoice} className="text-slate-200 text-4xl" />
           </div>
           <h3 className="text-slate-400 font-bold">Search for Invoice ID...</h3>
        </div>
      )}
    </div>
  );
};

const DetailCard = ({ title, name, time, date, icon, highlight }) => (
  <div className={`p-6 rounded-3xl transition-all hover:shadow-lg border border-slate-50 ${highlight ? 'bg-white ring-4 ring-[#81181C]/5 border-[#81181C]/20' : 'bg-white border-slate-100'}`}>
    <div className='flex justify-between'>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#81181C] mb-4">{title}</p>
        <p><span className='text-sm bg-orange-100 px-3 rounded-lg text-orange-700 font-semibold border border-orange-200'>4 min</span></p>
    </div>
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
        <FontAwesomeIcon icon={icon} size="lg" />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 leading-tight">{name}</h4>
        <p className="text-xs text-slate-400 font-medium">Employee</p>
      </div>
    </div>
    <div className="flex items-center justify-between text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div className="flex items-center gap-2 text-xs font-bold">
        <FontAwesomeIcon icon={faClock} className="text-[#81181C]" />
        {time}
      </div>
      <div className="text-[10px] font-black uppercase tracking-wider">{date}</div>
    </div>
  </div>
);

export default BillStatusOverview;