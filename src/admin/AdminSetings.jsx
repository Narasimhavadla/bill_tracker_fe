import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "sonner";
import axios from "axios";

import AddEmployeeModal from "./AdminComponents/AddEmployee";
import EmpDelete from "./AdminComponents/EmpDelModal";
import EditEmployeeModal from "./AdminComponents/EmpUpdateModal";

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 
      ${enabled ? "bg-[#81181C]" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 
        ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
};

const Settings = () => {
  const api = import.meta.env.VITE_API_BASE_URL;

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmpDel, setShowEmpDel] = useState(false);
  const [selectEmpId, setSelectEmpId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Helper function to ensure permission values are always booleans
  const formatPermissions = (emp) => ({
    ...emp,
    canPick: emp.canPick === '1' || emp.canPick === 1 || emp.canPick === true,
    canVerify: emp.canVerify === '1' || emp.canVerify === 1 || emp.canVerify === true,
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${api}/employees`);
      // Bug fix: Added safety check for nested data structure
      const rawData = res.data?.data || res.data || [];
      const formattedEmployees = rawData.map(formatPermissions);
      setEmployees(formattedEmployees);
    } catch (error) {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = (newEmployee) => {
    // Bug fix: Format permissions for locally added employees to match state
    setEmployees((prev) => [formatPermissions(newEmployee), ...prev]);
  };

  const handleUpdateEmployee = (updatedEmp) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmp.id ? formatPermissions(updatedEmp) : emp))
    );
  };

  const togglePermission = async (id, field) => {
    const employee = employees.find((emp) => emp.id === id);
    if (!employee) return;

    const updatedValue = !employee[field];

    try {
      // Optimistic UI update
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, [field]: updatedValue } : emp
        )
      );

      await axios.patch(`${api}/employees/${id}/permissions`, {
        [field]: updatedValue,
      });

      toast.success(`Permission updated for ${employee.empName}`);
    } catch (error) {
      // rollback
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, [field]: !updatedValue } : emp
        )
      );
      toast.error("Permission update failed");
    }
  };

  const getStatusBadge = (canPick, canVerify) => {
    if (canPick && canVerify)
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          Full Access
        </span>
      );
    if (canPick)
      return (
        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
          Picker
        </span>
      );
    if (canVerify)
      return (
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
          Verifier
        </span>
      );
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-400 text-xs font-bold rounded-full">
        No Access
      </span>
    );
  };

  // Bug fix: Added null check for empName and case-insensitive search
  const filteredEmployees = employees.filter((emp) =>
    (emp?.empName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          System <span className="text-[#81181C]">Permissions</span>
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#81181C] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#6a1317] transition-colors"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Add Employee
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search employee by name..."
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#81181C] outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase">
              <th className="p-4 text-left text-gray-600">Employee</th>
              <th className="p-4 text-center text-gray-600">Picking</th>
              <th className="p-4 text-center text-gray-600">Verifying</th>
              <th className="p-4 text-center text-gray-600">Actions</th>
              <th className="p-4 text-right text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id || emp.empId} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{emp.empName}</div>
                    <div className="text-xs text-gray-400">
                      {emp.empId} | {emp.phone}
                    </div>
                  </td>

                  <td className="text-center">
                    <ToggleSwitch
                      enabled={emp.canPick}
                      onChange={() => togglePermission(emp.id, "canPick")}
                    />
                  </td>

                  <td className="text-center">
                    <ToggleSwitch
                      enabled={emp.canVerify}
                      onChange={() => togglePermission(emp.id, "canVerify")}
                    />
                  </td>

                  <td className="text-center space-x-3">
                    <FontAwesomeIcon
                      icon={faPen}
                      className="text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowEditModal(true);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-400 cursor-pointer hover:text-red-700 transition-colors"
                      onClick={() => {
                        setSelectEmpId(emp.id);
                        setShowEmpDel(true);
                      }}
                    />
                  </td>

                  <td className="text-right pr-6">
                    {getStatusBadge(emp.canPick, emp.canVerify)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  No employees found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEmployee}
      />

      {showEmpDel && (
        <EmpDelete
          onClose={() => setShowEmpDel(false)}
          employeeId={selectEmpId}
          refresh={fetchEmployees}
        />
      )}

      <EditEmployeeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        employee={selectedEmployee}
        onUpdate={handleUpdateEmployee}
      />
    </div>
  );
};

export default Settings;