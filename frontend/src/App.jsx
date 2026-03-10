import { useState } from "react";
import Dashboard from "./components/Dashboard";
import EmployeeManagement from "./components/EmployeeManagement";
import AttendanceManagement from "./components/AttendanceManagement";

export default function App(){

const [tab,setTab] = useState("dashboard")

return(

<div className="min-h-screen">

{/* HEADER */}

<header className="bg-white border-b">

<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

<div>
<h1 className="text-xl font-semibold">
HRMS Lite
</h1>
<p className="text-xs text-gray-500">
Human Resource Management System
</p>
</div>

</div>

</header>


{/* NAVIGATION */}

<div className="max-w-7xl mx-auto px-4 mt-4">

<div className="flex gap-2 bg-gray-100 p-1 rounded-lg">

<TabButton
label="Dashboard"
active={tab==="dashboard"}
onClick={()=>setTab("dashboard")}
/>

<TabButton
label="Employees"
active={tab==="employees"}
onClick={()=>setTab("employees")}
/>

<TabButton
label="Attendance"
active={tab==="attendance"}
onClick={()=>setTab("attendance")}
/>

</div>

</div>


{/* CONTENT */}

<main className="max-w-7xl mx-auto px-4 py-6">

<div className="bg-white border rounded-xl p-5 shadow-sm">

{tab==="dashboard" && <Dashboard/>}
{tab==="employees" && <EmployeeManagement/>}
{tab==="attendance" && <AttendanceManagement/>}

</div>

</main>

</div>

)

}


function TabButton({label,active,onClick}){

return(

<button
onClick={onClick}
className={`flex-1 py-2 rounded-md text-sm font-medium transition
${active
? "bg-blue-600 text-white"
: "text-gray-600 hover:bg-gray-200"}
`}
>
{label}
</button>

)

}