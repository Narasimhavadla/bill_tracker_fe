import React from 'react';
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileInvoice, faTruckLoading, 
  faClipboardCheck, faBoxOpen, faCheckCircle, 
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import Logo from "../assets/MediSys_LOGO.jpg"
import axios from 'axios';
import { motion } from "framer-motion"; // ✅ animation

const ExternalDashboard = () => {

 const api = import.meta.env.VITE_API_BASE_URL

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

  // status priority
  const statusPriority = {
    "collect": 1,
    "verifying": 2,
    "picking": 3,
    "billed": 4
  };

  // sorted orders
 const sortedOrders = [...order]
  .filter(o => !o.isHidden)
  .sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );

  const maskMobileNumber = (number) => {
    if (!number || number.length < 10) return number;
    const firstTwo = number.slice(0, 2);
    const lastFour = number.slice(-4);
    return `${firstTwo}XXXX${lastFour}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'billed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'picking': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'verifying': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'collect': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-0 md:p-0 bg-slate-50 min-h-screen">

      {/* Brand Ribbon */}
      <div className="w-full bg-[#81181C] shadow-md mb-6">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center gap-4">
          <img 
            src={Logo} 
            alt="MediSys Logo" 
            className="h-16 w-auto"
          />
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">
              MediSYS Pharma Mall
            </h1>
            <p className='text-white text-center text-sm'>
              One stop for All Pharma Needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-800 uppercase">Bill No</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-800 uppercase">Customer Details</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-800 uppercase">Mobile</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-800 uppercase">Items Count</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-800 uppercase">Time Elapsed</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-800 uppercase">Status</th>
                </tr>
              </thead>

              {/* ✅ Motion tbody */}
              <motion.tbody layout className="divide-y divide-slate-100">

                {sortedOrders.map((order) => (

                  <motion.tr
                    key={order.id}
                    layout
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="hover:bg-slate-50/80 transition-colors"
                  >

                    <td className="px-6 py-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                          <FontAwesomeIcon icon={faFileInvoice} />
                        </div>
                        <span className="font-bold text-slate-700">
                          {order.billNum}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-1 font-medium text-slate-900 text-center">
                      {order.customerName}
                    </td>

                    <td className="px-6 py-1 text-sm text-slate-600 font-mono">
                      {maskMobileNumber(order.mobile)}
                    </td>

                    <td className="px-6 py-1 text-center">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-bold">
                        {order.itemsCount} Units
                      </span>
                    </td>

                    <td className="px-6 py-1 text-sm text-slate-600 font-semibold text-center">
                      <span className={`${order.liveTotalElapsedSecs >= 15 ? "bg-red-200 text-red-500 px-3 py-1 rounded-xl" : ""}`}>
                        {order.liveTotalElapsedSecs >= 15 ? (
                          <>
                            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
                            Contact Help Desk
                          </>
                        ) : (
                          order.liveTotalElapsedSecs + " min"
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-1">
                      <div className="flex justify-center">
                        <span className={`w-36 justify-center px-4 py-1.5 rounded-full text-[11px] font-bold border ${getStatusStyle(order.status)} flex items-center gap-2 uppercase`}>

                          {order.status === 'billed' && <FontAwesomeIcon icon={faCheckCircle} />}
                          {order.status === 'picking' && <FontAwesomeIcon icon={faTruckLoading} />}
                          {order.status === 'verifying' && <FontAwesomeIcon icon={faClipboardCheck} />}
                          {order.status === 'collect' && <FontAwesomeIcon icon={faBoxOpen} />}

                          {order.status}

                        </span>
                      </div>
                    </td>

                  </motion.tr>

                ))}

              </motion.tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalDashboard;