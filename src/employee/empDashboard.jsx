import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faTimes, faClipboardList, faSignOutAlt,
  faBoxesPacking, faCheckDouble, faMoneyBill,
  faChartSimple
} from '@fortawesome/free-solid-svg-icons';

import Logo from "../assets/MediSys_LOGO.jpg";

// Components
import InternalDashboard from '../admin/internalDashboard';
import AdminPicking from '../admin/AdminPicking';
import Verifying from '../admin/AdminVerifying';
import AdminBilling from '../admin/AdminBilling';
import LogoutModal from '../admin/AdminComponents/logoutModal';
import EmployeePerformance from './EmplPerformance';

export default function EmpDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [userPermissions, setUserPermissions] = useState({
    canViewOrders: true, 
    // canBill: false,
    canPick: false,
    canVerify: false,
  });

  const empName = localStorage.getItem("userName")
  const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

useEffect(() => {
  const fetchPermissions = async () => {
    try {

      if (!empName) return;

      const res = await axios.get(`${api}/employees`);

      const employees = res.data.data; // correct path

      const employee = employees.find(
        emp => emp.empName.toLowerCase() === empName.toLowerCase()
      );

      if (employee) {
        setUserPermissions({
          canViewOrders: true,
          // canBill: employee.canBill === '1' || employee.canBill === 1 || employee.canBill === true,
          canPick: employee.canPick === '1' || employee.canPick === 1 || employee.canPick === true,
          canVerify: employee.canVerify === '1' || employee.canVerify === 1 || employee.canVerify === true,
        });
      }

    } catch (err) {
      console.error("Failed to fetch employee permissions", err);
    }
  };

  fetchPermissions();

}, [empName, api]);

// localStorage.setItem("empName",empName);


  const menuItems = [
    { id: 'orders', label: 'Live Orders', icon: faClipboardList, permission: 'canViewOrders' },
    // { id: 'billing', label: 'Billing', icon: faMoneyBill, permission: 'canBill' },
    { id: 'picking', label: 'Picking', icon: faBoxesPacking, permission: 'canPick' },
    { id: 'Verifying', label: 'Verifying', icon: faCheckDouble, permission: 'canVerify' },
    // { id: 'myinsights', label: 'My Insights', icon: faChartSimple, permission: 'canViewOrders' },
  ];

const filteredMenu = menuItems.filter(
  item => Boolean(userPermissions[item.permission])
);

  const renderActiveComponent = () => {
    const currentItem = menuItems.find(item => item.id === activeTab);
    if (!userPermissions[currentItem?.permission]) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <h3 className="text-xl font-bold">Access Restricted</h3>
          <p>You do not have permission to view this module.</p>
        </div>
      );
    }

    const sharedProps = {
      onMenuClick: () => setIsSidebarOpen(true),
      isSidebarOpen: isSidebarOpen
    };

    switch (activeTab) {
      case 'orders': return <InternalDashboard {...sharedProps} />;
      case 'picking': return <AdminPicking {...sharedProps} />;
      // case 'billing': return <AdminBilling />;
      case 'Verifying': return <Verifying />;
      // case 'myinsights': return <EmployeePerformance />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col relative">
      <div className=" w-full bg-[#81181C] shadow-md z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>

          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-10 md:h-12" />
            <div className="text-center">
              <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-tight">MediSYS Employee</h1>
              <p className='text-white/70 text-[10px] tracking-[0.2em] uppercase font-bold'>Dashboard panel</p>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 bg-[#81181C] flex items-center px-6 text-white justify-between">
          <span className="font-bold text-lg tracking-tight">Employee Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-red-50 text-[#81181C] shadow-sm ring-1 ring-red-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-5" />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="mb-4 px-4">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-bold text-slate-800">{empName}</p>
          </div>
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="flex items-center gap-4 text-red-600 hover:bg-red-50 transition-colors w-full px-4 py-4 rounded-xl font-bold"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* --- OVERLAY --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full animate-in fade-in duration-500">
        {renderActiveComponent()}
      </main>

      {/* --- LOGOUT MODAL --- */}
              <LogoutModal 
                isOpen={isLogoutOpen} 
                onClose={() => setIsLogoutOpen(false)} 
                onConfirm={() => {
                  console.log("Logging out...");
                  // Perform logout logic here (e.g., clear localStorage)
                  navigate('/'); 
                  setIsLogoutOpen(false);
                }}
              />

    </div>
  );
}