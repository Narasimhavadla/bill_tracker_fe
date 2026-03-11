import React, { useEffect } from 'react';
import {useState} from "react"
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

  const [visibleRows, setVisibleRows] = useState({});


  const [order,setOrder] = useState([])
  const orders = [
    { id: 1, customer: "Anil Kumar", billNo: "PM-8829", items: 2, time: 5, status: "Billed", elapsedMinutes: 3, assignedTo: "Suresh M." },
    { id: 3, customer: "Rahul Sharma", billNo: "PM-8831", items: 4, time: 1, status: "Verifying", elapsedMinutes: 4, assignedTo: "Priya V." },
    { id: 2, customer: "Saira Banu", billNo: "PM-8830", items: 10, time: 0, status: "Picking", elapsedMinutes: 8, assignedTo: "Rahul K." },
    { id: 4, customer: "Jessica Doe", billNo: "PM-8832", items: 12, time: 15, status: "Collect Order", elapsedMinutes: 12, assignedTo: "Amit S." },
  ];

 

  // Status priority for sorting
  const statusPriority = {
    "Collect Order": 1,
    "Verifying": 2,
    "Picking": 3,
    "Billed": 4
  };

  // Sort orders based on status priority
  const sortedOrders = [...orders].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Billed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Picking': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Verifying': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Collect Order': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
                            <div className="font-bold text-slate-700">{order.billNo}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">{order.items} Items</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {order.customer}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-600 font-mono text-sm">
                        9999999999
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className={`flex items-center gap-2 font-mono font-bold ${isDelayed ? 'text-red-600' : 'text-slate-600'}`}>
                            <FontAwesomeIcon 
                              icon={isDelayed ? faExclamationTriangle : faClock} 
                              className={isDelayed ? "animate-pulse" : ""} 
                            />
                            <span>{order.elapsedMinutes} min</span>
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
                            {order.time} min ago by {order.assignedTo}
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
                          <span className={`w-36 justify-center px-4 py-1.5 rounded-full text-[11px] font-bold border ${getStatusStyle(order.status)} flex items-center gap-2 uppercase`}>

                            {order.status === 'Billed' && <FontAwesomeIcon icon={faCheckCircle} />}
                            {order.status === 'Picking' && <FontAwesomeIcon icon={faTruckLoading} />}
                            {order.status === 'Verifying' && <FontAwesomeIcon icon={faClipboardCheck} />}
                            {order.status === 'Collect Order' && <FontAwesomeIcon icon={faBoxOpen} />}

                            {order.status}

                          </span>
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