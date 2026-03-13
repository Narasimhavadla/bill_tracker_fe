import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faBoxOpen, faClock,
  faExclamationTriangle, faCheck, faMicrophone, faBullhorn
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import axios from 'axios'; // Ensure axios is installed

export default function AdminCollection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_BASE_URL

  // 1. Fetch Live Feed from API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${api}/order/live-feed`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error("Failed to sync with server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // 2. Voice Announcement Logic
  const playAnnouncement = (customerName) => {
    window.speechSynthesis.cancel();
    const message = `Hello ${customerName}, your order is completed. Please collect.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    toast.info(`Announcing for ${customerName}`, { icon: <FontAwesomeIcon icon={faBullhorn} /> });
  };

  // 3. Complete Order API Call
  const handleCompleteOrder = async (billNum) => {
    try {
      const response = await axios.patch(`${api}/order/complete/${billNum}`);
      if (response.status === 200) {
        toast.success(`Order ${billNum} Handed Over Successfully`);
        fetchOrders(); // Refresh list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error completing order");
    }
  };

  const getMinutesAgo = (timestamp) => {
    const diffInMinutes = Math.floor((new Date() - new Date(timestamp)) / (1000 * 60));
    return diffInMinutes > 0 ? diffInMinutes : 0;
  };

  // Filter only those ready for collection
  const collectionOrders = orders.filter(o => o.status === 'collect');

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Collection Counter</h1>
            <p className="text-slate-500 text-sm font-medium">Final verification and voice announcements</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
             <span className="text-[10px] font-black uppercase text-slate-400">Live Status</span>
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Customer Detail</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Time Ellapsed</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">picked by</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Announce</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Final Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {collectionOrders.length > 0 ? (
                collectionOrders.map((order) => {
                  const minutesElapsed = getMinutesAgo(order.collectAt);
                  const isDelayed = minutesElapsed > 5; // Delayed if waiting in collection > 5 mins

                  return (
                    <tr key={order.billNum} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <FontAwesomeIcon icon={faFileInvoice} />
                          </div>
                          <div>
                            <div className="font-black text-slate-800 tracking-tight">{order.billNum}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">{order.itemsCount} Items</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{order.customerName}</div>
                        <div className="text-xs text-slate-400 font-medium">{order.mobile}</div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-2 font-mono font-black text-sm ${isDelayed ? 'text-orange-600' : 'text-slate-600'}`}>
                          <FontAwesomeIcon icon={isDelayed ? faExclamationTriangle : faClock} className={isDelayed ? "animate-bounce" : ""} />
                          <span>{minutesElapsed} MINS</span>
                        </div>
                      </td>
                      <td>-</td>

                      {/* NEW: Announcement Column */}
                      <td className="px-2 py-4 text-center">
                        <button 
                          onClick={() => playAnnouncement(order.customerName)}
                          className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-100"
                          title="Call Customer"
                        >
                          <FontAwesomeIcon icon={faMicrophone} />
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleCompleteOrder(order.billNum)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#81181C] text-white rounded-xl font-bold text-xs shadow-lg shadow-red-900/20 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          COMPLETE & HANDOVER
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <FontAwesomeIcon icon={faBoxOpen} size="4x" />
                      <p className="mt-4 font-black text-xl uppercase tracking-tighter">Queue Clear - No Orders to Collect</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}