// LogoutModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Logout</h3>
          <p className="text-slate-500 mb-8">
            Are you sure you want to log out of the MediSYS Management System?
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              close
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-[#81181C] hover:bg-[#631215] text-white font-bold rounded-xl shadow-lg shadow-red-900/20 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}