import React, { useEffect } from 'react';
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faTruckLoading, faClipboardCheck,
  faBoxOpen, faCheckCircle, faUserShield, faClock,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faMicrophone
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const InternalDashboard = () => {


  const api = import.meta.env.VITE_API_BASE_URL
  const [visibleRows, setVisibleRows] = useState({});
  const [isAudible, setIsAudible] = useState({});


  const [order, setOrder] = useState([])


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${api}/order/live-feed`)

        setOrder(res.data.orders)
        console.log(res.data.orders.status)
      }
      catch (err) {
        console.log(err)
      }
    }

    fetchOrders()
  }, [])


  const statusPriority = {
    "collect": 1,
    "verifying": 2,
    "picking": 3,
    "billed": 4
  };

  // Sort orders based on status priority
  const sortedOrders = [...order].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case 'billed':
        return {
          badge: 'bg-blue-100 text-blue-700 border-blue-300',
          dot: 'bg-blue-500',
          pulse: false,
          icon: faCheckCircle,
          label: 'Billed',
        };
      case 'picking':
        return {
          badge: 'bg-amber-100 text-amber-700 border-amber-300',
          dot: 'bg-amber-500',
          pulse: true,
          icon: faTruckLoading,
          label: 'Picking',
        };
      case 'verifying':
        return {
          badge: 'bg-purple-100 text-purple-700 border-purple-300',
          dot: 'bg-purple-500',
          pulse: true,
          icon: faClipboardCheck,
          label: 'Verifying',
        };
      case 'collect':
        return {
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
          dot: 'bg-emerald-500',
          pulse: true,
          icon: faBoxOpen,
          label: 'Collect',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          pulse: false,
          icon: faClock,
          label: status || 'Unknown',
        };
    }
  };

const toggleEye = async (billNum) => {
  try {

    const res = await axios.patch(`${api}/order/toggle-hide/${billNum}`)

    const updatedHidden = res.data.order.isHidden

    setOrder(prev =>
      prev.map(o =>
        o.billNum === billNum ? { ...o, isHidden: updatedHidden } : o
      )
    )

  } catch (err) {
    console.log(err)
  }
};

const formatToMinutesOnly = (totalSeconds) => {
  if (!totalSeconds && totalSeconds !== 0) return "0";
  const minutes = Math.floor(totalSeconds /60);
  return `${minutes}`;
};

const getMinutesAgo = (timestamp) => {
  if (!timestamp) return "0";
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  return diffInMinutes > 0 ? diffInMinutes : 0;
};


const playAnnouncement = (customerName) => {
  // Cancel any ongoing speech to avoid overlapping
  window.speechSynthesis.cancel();

  const message = `Hello ${customerName}, your order is completed. Please collect.`;
  const utterance = new SpeechSynthesisUtterance(message);
  
  // Optional: Professional settings
  utterance.rate = 0.9; 
  utterance.pitch = 1; 
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">

      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider">Bill Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Time Elapsed</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider">Assigned To</th>
                  <th className=" py-4 text-xs font-bold text-slate-800 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sortedOrders.map((order) => {

                  const isDelayed = order.liveTotalElapsedSecs > 5;

                  return (
                    <tr key={order.id} className={`hover:bg-slate-50/80 transition-colors ${order.isHidden ? "opacity-40" : ""}`}>

                      <td className="px-6 py-4 ">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-400 text-white rounded-lg">
                            <FontAwesomeIcon icon={faFileInvoice} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-700">{order.billNum}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">{order.itemsCount} Items</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {order.customerName}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-600 font-mono text-sm">
                        {order.mobile}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className={`flex items-center gap-2 font-mono font-bold ${isDelayed ? 'text-red-600' : 'text-slate-600'}`}>
                            <FontAwesomeIcon
                              icon={isDelayed ? faExclamationTriangle : faClock}
                              className={isDelayed ? "animate-pulse" : ""}
                            />
                            {/* <span>{order.elapsedMinutes} min</span> */}
                            <span> {getMinutesAgo(order.billedAt)} min</span>
                          </div>

                          {isDelayed && (
                            <span className="text-[9px] text-red-500 font-bold uppercase mt-1">
                              Longer Than Expected
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FontAwesomeIcon icon={faUserShield} className="text-slate-400 text-xs" />
                          <span className="text-sm font-semibold">
                            {/* {order.time} min ago by {order.assignedTo} */}
                             {formatToMinutesOnly(order.liveTotalElapsedSecs)} min ago by {order.pickerName}
                            {/* {getMinutesAgo(order.verifiedAt)} min ago by {order.verifierName} */}
                          </span>
                        </div>
                      </td>
                     <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        
                        {/* Details Toggle (Always Visible) */}
                        <div className="relative group flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={order.isHidden ? faEyeSlash : faEye}
                            className={`cursor-pointer transition-colors ${
                              // visibleRows[order.id] ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'
                            order.isHidden ? 'text-red-500' : 'text-emerald-600'
                            }`}
                            onClick={() => toggleEye(order.billNum, order.id)}
                          />
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-sm">
                            {visibleRows[order.id] ? "Click to show details" : "Click to hide details"}
                          </span>
                        </div>

                        {/* Collect Audio Action (Conditional) */}
                        {order.status === 'collect' && (
                          <div className="relative group flex items-center justify-center">
                            <button 
                              onClick={() => playAnnouncement(order.customerName)}
                              className="focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded-full p-1 transition-all"
                            >
                              <FontAwesomeIcon 
                                icon={faMicrophone} 
                                className="cursor-pointer text-emerald-500 hover:text-emerald-700 transition-all hover:scale-125 active:scale-95"
                              />
                            </button>
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                              Click to play collect order
                            </span>
                          </div>
                        )}

                      </div>
                    </td>


                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {(() => {
                            const cfg = getStatusConfig(order.status);
                            return (
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border ${cfg.badge}`}
                                style={{ minWidth: '130px', justifyContent: 'center' }}
                              >
                                {/* Animated pulse dot for active statuses */}
                                <span className="relative flex h-2 w-2 flex-shrink-0">
                                  {cfg.pulse && (
                                    <span
                                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dot}`}
                                    />
                                  )}
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
                                </span>
                                <FontAwesomeIcon icon={cfg.icon} className="text-[10px]" />
                                <span className="uppercase tracking-wide">{cfg.label}</span>
                              </span>
                            );
                          })()}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default InternalDashboard;