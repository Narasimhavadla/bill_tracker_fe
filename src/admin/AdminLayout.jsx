import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, faTimes, faUsers, 
  faClipboardList, faSignOutAlt, faChartLine, 
  faIdBadge, faCheck, faGear,
  faBoxesPacking, faChartSimple, faCheckDouble, faMoneyBill,
  faBarcode
} from '@fortawesome/free-solid-svg-icons';

// Components
import InternalDashboard from './internalDashboard'; 
import AdminPicking from './AdminPicking';
import Logo from "../assets/MediSys_LOGO.jpg";
import Verifying from './AdminVerifying';
import Settings from './AdminSetings';
import AdminAnalytics from './AdminAnalytics';
import EmployeePerformance from './AdminEmpAnalytics';
import AdminBilling from './AdminBilling';
import LogoutModal from './AdminComponents/logoutModal';
import BillStatusOverview from './AdminInvoiceOverview';



const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  
  // SIMULATED USER: In a real app, this comes from your Login/Auth Context
  const [userPermissions] = useState({
    canViewAnalytics: true,
    canViewOrders: true,
    // canBill: true,     
    canPick: true,     
    canVerify: true,
    canViewEmpAnalytics: true,
    isAdmin: true       // Controls Settings access
  });

  // Default active tab must be one they have access to
  const [activeTab, setActiveTab] = useState('orders');

  // 1. Centralized Menu Items with "permission" key
  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: faChartLine, permission: 'canViewAnalytics' },
    { id: 'orders', label: 'Live Orders', icon: faClipboardList, permission: 'canViewOrders' },
    // { id: 'billing', label: 'Billing', icon: faMoneyBill, permission: 'canBill' },
    { id: 'picking', label: 'Picking', icon: faBoxesPacking, permission: 'canPick' },
    { id: 'Verifying', label: 'verifying', icon: faCheckDouble, permission: 'canVerify' },
    { id: 'EmployeeAnalytics', label: 'Emp Analytics', icon: faChartSimple, permission: 'canViewEmpAnalytics' },
    { id: 'MasterBill', label: 'Invoice Overview', icon: faBarcode, permission: 'isAdmin' },
    { id: 'Settings', label: 'settings', icon: faGear, permission: 'isAdmin' },
  ];

  // Filter menu based on user permissions
  const filteredMenu = menuItems.filter(item => userPermissions[item.permission]);

  // 2. Dynamic Component Renderer
  const renderActiveComponent = () => {
    // Security Check: If user tries to access a tab they aren't permitted for
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
      case 'picking': return <AdminPicking />;
      // case 'billing': return <AdminBilling />;
      case 'Verifying': return <Verifying />;
      case 'Settings': return <Settings />;
      case 'analytics': return <AdminAnalytics />;
      case 'MasterBill': return <BillStatusOverview />;
      case 'EmployeeAnalytics': return <EmployeePerformance />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col relative">
      
      {/* --- HEADER --- */}
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
              <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-tight">MediSYS Internal</h1>
              <p className='text-white/70 text-[10px] tracking-[0.2em] uppercase font-bold'>Management System</p>
            </div>
          </div>
          <div className="w-10"></div> 
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 bg-[#81181C] flex items-center px-6 text-white justify-between">
          <span className="font-bold text-lg tracking-tight">MediSYS Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="flex-1 py-2 px-4 space-y-1">
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

        <div className="p-3 border-t border-slate-100">
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
            localStorage.removeItem("userRole")
            localStorage.removeItem("userName")
            localStorage.removeItem("authToken")
            navigate('/'); 
            setIsLogoutOpen(false);
          }}
        />
    </div>
  );
};

export default AdminLayout;