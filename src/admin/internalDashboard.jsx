import React, { useEffect } from 'react';
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faTruckLoading, faClipboardCheck,
  faBoxOpen, faCheckCircle, faUserShield, faClock,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faMicrophone,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import { motion } from "framer-motion"; // ✅ animation library

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

  const handleCompleteOrder = async (billNum) => {
    try {

      const res = await axios.patch(`${api}/order/complete/${billNum}`);

      if (res.status === 200) {

        // remove order from list (since it is completed)
        setOrder(prev => prev.filter(o => o.billNum !== billNum));

        console.log(`Order ${billNum} completed`);

      }

    } catch (err) {
      console.log(err);
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
    const minutes = Math.floor(totalSeconds / 60);
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

    window.speechSynthesis.cancel();

    const message = `Hello ${customerName}, your order is completed. Please collect.`;

    const utterance = new SpeechSynthesisUtterance(message);

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const getAssignedDisplay = (order) => {
    switch (order.status) {
      case "billed":
        return {
          text: "Billed",
          icon: faFileInvoice
        };

      case "picking":
        return {
          text: `Picking Started`,
          icon: faTruckLoading
        };

      case "verifying":
        return {
          text: `picked by ${order.pickerName} ` || "Picker",
          icon: faTruckLoading
        };

      case "collect":
        return {
          text: `verified by ${order.verifierName}` || "Verifier",
          icon: faClipboardCheck
        };

      default:
        return {
          text: "-",
          icon: faUserShield
        };
    }
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
                  <th className="py-4 text-xs font-bold text-slate-800 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>

              {/* ✅ Motion tbody for layout animation */}
              <motion.tbody layout className="divide-y divide-slate-100">

                {sortedOrders.map((order) => {

                  const isDelayed = order.liveTotalElapsedSecs > 300;

                  return (

                    <motion.tr
                      key={order.id}
                      layout
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className={`hover:bg-slate-50/80 transition-colors ${order.isHidden ? "opacity-40" : ""}`}
                    >

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

                            <span>{getMinutesAgo(order.billedAt)} min</span>

                          </div>

                          {isDelayed && (

                            <span className="text-[9px] text-red-500 font-bold uppercase mt-1">
                              Longer Than Expected
                            </span>

                          )}

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        {(() => {

                          const assigned = getAssignedDisplay(order);

                          return (

                            <div className="flex items-center gap-2 text-slate-600">

                              <FontAwesomeIcon
                                icon={assigned.icon}
                                className="text-slate-400 text-xs"
                              />

                              <span className="text-sm font-semibold">
                                {assigned.text}
                              </span>

                            </div>

                          );

                        })()}

                      </td>

                      {/* <td className="px-6 py-4">

                        <div className="flex items-center justify-center gap-4">

                          <FontAwesomeIcon
                            icon={order.isHidden ? faEyeSlash : faEye}
                            className={`cursor-pointer ${order.isHidden ? 'text-red-500' : 'text-emerald-600'}`}
                            onClick={() => toggleEye(order.billNum)}
                          />

                          {order.status === 'collect' && (

                            <button onClick={() => playAnnouncement(order.customerName)}>

                              <FontAwesomeIcon
                                icon={faMicrophone}
                                className="text-emerald-500 hover:scale-125 transition-all"
                              />

                            </button>

                          )}

                        </div>

                      </td> */}

                      <td className="px-6 py-4">

                        <div className="flex items-center justify-center gap-4">

                          {/* Hide / Unhide */}
                          <FontAwesomeIcon
                            icon={order.isHidden ? faEyeSlash : faEye}
                            className={`cursor-pointer ${order.isHidden ? 'text-red-500' : 'text-emerald-600'}`}
                            onClick={() => toggleEye(order.billNum)}
                          />

                          {/* Voice announcement */}
                          {order.status === 'collect' && (

                            <button onClick={() => playAnnouncement(order.customerName)}>

                              <FontAwesomeIcon
                                icon={faMicrophone}
                                className="text-blue-500 hover:scale-125 transition-all"
                              />

                            </button>

                          )}

                          {/* COMPLETE ORDER */}
                          {order.status === 'collect' && (

                            <button onClick={() => handleCompleteOrder(order.billNum)}>

                              <FontAwesomeIcon
                                icon={faCheckDouble}
                                className="text-emerald-600 hover:text-green-700 hover:scale-125 transition-all cursor-pointer"
                                title="Complete Order"
                              />

                            </button>

                          )}

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-center">

                          {(() => {

                            const cfg = getStatusConfig(order.status);

                            return (

                              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border ${cfg.badge}`}>

                                <span className="relative flex h-2 w-2 flex-shrink-0">

                                  {cfg.pulse && (
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dot}`} />
                                  )}

                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />

                                </span>

                                <FontAwesomeIcon icon={cfg.icon} className="text-[10px]" />

                                <span className="uppercase tracking-wide">{cfg.label}</span>

                              </span>

                            )

                          })()}

                        </div>

                      </td>

                    </motion.tr>

                  )

                })}

              </motion.tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InternalDashboard;