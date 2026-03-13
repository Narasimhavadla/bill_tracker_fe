import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
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

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmpDel, setShowEmpDel] = useState(false);
  const [selectEmpId,setSelectEmpId] = useState(null)


  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const handleUpdateEmployee = (updatedEmp) => {
  setEmployees((prev) =>
    prev.map((emp) => (emp.id === updatedEmp.id ? {
      ...updatedEmp,
      canPick: updatedEmp.canPick === '1' || updatedEmp.canPick === 1 || updatedEmp.canPick === true,
      canVerify: updatedEmp.canVerify === '1' || updatedEmp.canVerify === 1 || updatedEmp.canVerify === true,
    } : emp))
  );
};

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/employees"
        );

        const formattedEmployees = res.data.data.map((emp) => ({
          ...emp,
          // canBill: emp.canBill === '1' || emp.canBill === 1 || emp.canBill === true,
          canPick: emp.canPick === '1' || emp.canPick === 1 || emp.canPick === true,
          canVerify: emp.canVerify === '1' || emp.canVerify === 1 || emp.canVerify === true,
        }));

        setEmployees(formattedEmployees);

      } catch (error) {

        toast.error("Failed to fetch employees");

      }
    };


  // Fetch employees
  useEffect(() => {

  
    fetchEmployees();

  }, []);


  // Add employee locally
  const handleAddEmployee = (newEmployee) => {

    setEmployees((prev) => [newEmployee, ...prev]);

  };


  // Toggle permission
  const togglePermission = async (id, field) => {

    const employee = employees.find((emp) => emp.id === id);

    const updatedValue = !employee[field];

    try {

      // Optimistic UI update
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, [field]: updatedValue } : emp
        )
      );

      await axios.patch(
        `http://localhost:3000/api/v1/employees/${id}/permissions`,
        { [field]: updatedValue }
      );

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


  // Status badge
  // const getStatusBadge = (canPick, canVerify, canBill) => {
  const getStatusBadge = (canPick, canVerify) => {

    if (canPick && canVerify )
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          Full Access
        </span>
      );

    // if (canPick && canBill)
    //   return (
    //     <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
    //       Picker + Biller
    //     </span>
    //   );

    // if (canVerify && canBill)
    //   return (
    //     <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
    //       Verifier + Biller
    //     </span>
    //   );

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

    // if (canBill)
    //   return (
    //     <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full">
    //       Biller
    //     </span>
    //   );

    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-400 text-xs font-bold rounded-full">
        No Access
      </span>
    );

  };


  // Filter employees
  const filteredEmployees = employees.filter((emp) =>
    emp.empName.includes(searchTerm)
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
          className="bg-[#81181C] text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Add Employee
        </button>

      </div>


      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">

        <input
          type="text"
          placeholder="Search employee..."
          className="border p-3 rounded-lg w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>


      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="bg-gray-50 text-xs uppercase">
              <th className="p-4 text-left">Employee</th>
              {/* <th className="p-4 text-center">Billing</th> */}
              <th className="p-4 text-center">Picking</th>
              <th className="p-4 text-center">Verifying</th>
              <th className="p-4 text-center">Actions</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody>

            {filteredEmployees.map((emp) => (

              <tr key={emp.id} className="border-t">

                {/* Employee */}
                <td className="p-4">
                  <div className="font-bold">{emp.empName}</div>
                  <div className="text-xs text-gray-400">
                    {emp.empId} | {emp.phone}
                  </div>
                </td>


                {/* Billing */}
                {/* <td className="text-center">
                  <ToggleSwitch
                    enabled={emp.canBill}
                    onChange={() => togglePermission(emp.id, "canBill")}
                  />
                </td> */}


                {/* Picking */}
                <td className="text-center">
                  <ToggleSwitch
                    enabled={emp.canPick}
                    onChange={() => togglePermission(emp.id, "canPick")}
                  />
                </td>


                {/* Verifying */}
                <td className="text-center">
                  <ToggleSwitch
                    enabled={emp.canVerify}
                    onChange={() => togglePermission(emp.id, "canVerify")}
                  />
                </td>


                {/* Actions */}
                <td className="text-center space-x-2">

                  {/* Inside filteredEmployees.map Actions column */}
                <FontAwesomeIcon
                  icon={faPen}
                  className="text-slate-800 cursor-pointer"
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setShowEditModal(true);
                  }}
                />

                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer"
                    onClick={
                      () => {setShowEmpDel(true)
                        setSelectEmpId(emp.id)
                      }
                    }
                  />

                </td>


                {/* Status */}
                <td className="text-right pr-6">
                  {/* {getStatusBadge(emp.canPick, emp.canVerify, emp.canBill)} */}
                  {getStatusBadge(emp.canPick, emp.canVerify)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEmployee}
      />

      {showEmpDel && (
        <EmpDelete onClose={() => {
            setShowEmpDel(false) 
          }}
            employeeId = {selectEmpId}
            refresh = {fetchEmployees}
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

