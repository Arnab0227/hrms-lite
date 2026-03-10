import { useState, useEffect, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { getAttendance, updateAttendance, getEmployees, markAttendance } from "../api";

const fetcher = async () => {
  const [attendanceData, employeeData] = await Promise.all([
    getAttendance(),
    getEmployees()
  ]);

  const attendanceArray = Array.isArray(attendanceData)
    ? attendanceData
    : attendanceData.records || [];

  const employeeArray = Array.isArray(employeeData)
    ? employeeData
    : employeeData.records || [];

  return { attendanceArray, employeeArray };
};

export default function AttendanceManagement() {

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [filtered, setFiltered] = useState([]);

  const { data, isLoading, error, mutate: revalidate } = useSWR(
    "attendance-data",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      focusThrottleInterval: 5000
    }
  );

  const attendanceArray = data?.attendanceArray || [];
  const employeeArray = data?.employeeArray || [];

  const records = useMemo(() => {
    const fullRecords = attendanceArray.map(rec => ({
      ...rec,
      employee: employeeArray.find(emp => emp.id === rec.employee_id)
    })).filter(rec => rec.employee); 

    employeeArray.forEach(emp => {
      const hasRecord = attendanceArray.some(rec => rec.employee_id === emp.id);
      
      if (!hasRecord) {
        fullRecords.push({
          id: `temp-${emp.id}-${date}`,
          employee_id: emp.id,
          employee: emp,
          date: date,
          status: "",
          isTemporary: true
        });
      }
    });

    return fullRecords;
  }, [attendanceArray, employeeArray, date]);

  const updateFiltered = (selectedDate, allRecords) => {
    if (!selectedDate || !allRecords) {
      setFiltered(allRecords || []);
      return;
    }

    const existingRecords = allRecords.filter(
      (rec) => rec.date === selectedDate
    );

    const employeesWithRecords = new Set(existingRecords.map(rec => rec.employee_id));

    const placeholderRecords = employeeArray
      .filter(emp => !employeesWithRecords.has(emp.id))
      .map(emp => ({
        id: `temp-${emp.id}-${selectedDate}`,
        employee_id: emp.id,
        employee: emp,
        date: selectedDate,
        status: "",
        isTemporary: true
      }));

    const result = [...existingRecords, ...placeholderRecords].sort(
      (a, b) => (a.employee?.full_name || "").localeCompare(b.employee?.full_name || "")
    );

    setFiltered(result);
  };

  useEffect(() => {
    updateFiltered(date, records);
  }, [date, records]);

  function filterByDate(selectedDate) {
    setDate(selectedDate);
  }

  async function handleStatusChange(id, newStatus) {

  if (!id || !newStatus) return;

  const record = filtered.find(r => r.id === id);

  if (!record) {
    console.error("Record not found");
    return;
  }

  setFiltered(prev =>
    prev.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    )
  );

  try {

    if (id.toString().startsWith("temp")) {

      console.log("[v0] Sending attendance data:", {
        employee_id: record.employee_id,
        date: record.date,
        status: newStatus
      });

      await markAttendance({
        employee_id: record.employee_id,
        date: record.date,
        status: newStatus
      });

    } else {

      await updateAttendance(id, newStatus);

    }

    await revalidate();

  } catch (error) {

    console.error("Update failed", error);

  }
}

  function getPresentCount(employeeId) {
    return attendanceArray.filter(
      (r) =>
        r.employee_id === employeeId &&
        r.status === "Present"
    ).length;
  }

  const presentCount = records.filter(
    (a) => a.status === "Present"
  ).length;

  const absentCount = records.filter(
    (a) => a.status === "Absent"
  ).length;
  
  const loading = isLoading;

  return (

    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Attendance Management
        </h2>

        <p className="text-gray-600 mt-1">
          Track and manage employee attendance records
        </p>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-lg p-6">

          <p className="text-sm text-gray-600">
            Total Records
          </p>

          <p className="text-4xl font-bold mt-3">
            {records.length}
          </p>

        </div>

        <div className="bg-white border rounded-lg p-6">

          <p className="text-sm text-gray-600">
            Present
          </p>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {presentCount}
          </p>

        </div>

        <div className="bg-white border rounded-lg p-6">

          <p className="text-sm text-gray-600">
            Absent
          </p>

          <p className="text-4xl font-bold text-red-600 mt-3">
            {absentCount}
          </p>

        </div>

      </div>



      <div className="bg-white border rounded-lg">

        <div className="p-6">

          <label className="block text-sm font-medium mb-2">
            Filter by Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => filterByDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />

        </div>

      </div>



      <div className="bg-white border rounded-lg overflow-hidden">

        <div className="px-6 py-4 border-b bg-gray-50">

          <h3 className="text-lg font-semibold">
            Attendance Records
            <span className="text-sm text-gray-500 ml-2">
              ({filtered.length})
            </span>
          </h3>

        </div>


        {loading ? (

          <div className="p-10 text-center">

            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-600 mt-3">
              Loading attendance...
            </p>

          </div>

        ) : filtered.length === 0 ? (

          <div className="p-10 text-center">

            <p className="text-gray-600">
              No records found
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Employee ID
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Employee
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Total Present
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y">

                {filtered.map((rec) => (

                  <tr
                    key={rec.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {rec.employee?.employee_id || "N/A"}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {rec.employee?.full_name || "Deleted Employee"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {rec.date}
                    </td>



                    <td className="px-6 py-4">

                      <select

                        value={rec.status}

                        onChange={(e) =>
                          handleStatusChange(
                            rec.id,
                            e.target.value
                          )
                        }

                        disabled={!rec.isTemporary && rec.status !== ""}

                        className={`px-3 py-2 rounded-md text-sm font-semibold border

                        ${rec.status === "Present"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : rec.status === "Absent"
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                          } ${!rec.isTemporary && rec.status !== "" ? "opacity-50 cursor-not-allowed" : ""}`}

                      >

                        <option value="">-- Select Status --</option>

                        <option value="Present">
                          Present
                        </option>

                        <option value="Absent">
                          Absent
                        </option>

                      </select>

                    </td>


                    <td className="px-6 py-4 font-bold">

                      {getPresentCount(rec.employee_id)}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );
}
