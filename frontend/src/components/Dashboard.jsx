import { useEffect, useState } from "react";
import { getEmployees, getAttendance } from "../api";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const emp = await getEmployees();
    const att = await getAttendance();

    setEmployees(Array.isArray(emp) ? emp : []);
    setAttendance(Array.isArray(att) ? att : []);
    setLoading(false);
  }

  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const absentDays = attendance.filter((a) => a.status === "Absent").length;


  return (
    <div className="mt-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back. Here's your HR overview at a glance.</p>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-100 rounded-lg h-40 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-600">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{employees.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-600">Present Today</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{presentDays}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-600">Absent Today</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{absentDays}</p>
          </div>
        </div>

      )}

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-gray-600">Total Attendance Records</span>
              <span className="font-semibold text-gray-900">{attendance.length}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-gray-600">Attendance Rate</span>
              <span className="font-semibold text-gray-900">
                {attendance.length > 0
                  ? ((presentDays / attendance.length) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Departments</span>
              <span className="font-semibold text-gray-900">
                {new Set(employees.map((e) => e.department)).size}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <div className="space-y-3">
            {Array.from(new Set(employees.map((e) => e.department))).map((dept, idx) => {
              const count = employees.filter((e) => e.department === dept).length;
              const percentage = (count / employees.length) * 100;
              return (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{dept}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
