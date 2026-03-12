import React, { useEffect } from 'react';
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faTruckLoading, faClipboardCheck,
  faBoxOpen, faCheckCircle, faUserShield, faClock,
  faExclamationTriangle,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const InternalDashboard = () => {


  const api = import.meta.env.VITE_API_BASE_URL
  const [visibleRows, setVisibleRows] = useState({});


  const [order, setOrder] = useState([])

  // const orders = [
  //   { id: 1, customer: "Anil Kumar", billNo: "PM-8829", items: 2, time: 5, status: "billed", elapsedMinutes: 3, assignedTo: "Suresh M." },
  //   { id: 3, customer: "Rahul Sharma", billNo: "PM-8831", items: 4, time: 1, status: "verifying", elapsedMinutes: 4, assignedTo: "Priya V." },
  //   { id: 2, customer: "Saira Banu", billNo: "PM-8830", items: 10, time: 0, status: "picking", elapsedMinutes: 8, assignedTo: "Rahul K." },
  //   { id: 4, customer: "Jessica Doe", billNo: "PM-8832", items: 12, time: 15, status: "collect", elapsedMinutes: 12, assignedTo: "Amit S." },
  // ];


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${api}/order/live-feed`)

        setOrder(res.data.orders)
        // console.log(res.data)
        // console.log(res.data.orders)
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

  const toggleEye = (id) => {
    setVisibleRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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

                  const isDelayed = order.elapsedMinutes > 5;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
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
                            <span>- min</span>
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
                            - min ago by {order.assignedTo}
                          </span>
                        </div>
                      </td>
                      <td className="text-center text-sm relative group">
                        <FontAwesomeIcon
                          icon={visibleRows[order.id] ? faEyeSlash : faEye}
                          className="cursor-pointer text-slate-600 hover:text-slate-900"
                          onClick={() => toggleEye(order.id)}
                        />

                        <span className="absolute left-1/2 -translate-x-1/2 top-11 whitespace-nowrap bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-60 transition">
                          {visibleRows[order.id] ? "Click to show details" : "Click to hide details"}
                        </span>
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