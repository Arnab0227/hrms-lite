const API_URL = "https://hrms-lite-4ar5.onrender.com";

export async function getEmployees() {
  const res = await fetch(`${API_URL}/employees`);
  return res.json();
}

export async function createEmployee(data) {
  const res = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteEmployee(id) {
  await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
  });
}

export async function getAttendance() {
  const res = await fetch(`${API_URL}/attendance`);
  return res.json();
}

export async function markAttendance(data) {
  const payload = {
    employee_id: data.employee_id,
    date: data.date,
    status: data.status
  };
  console.log("[v0] Payload being sent:", payload);
  
  const res = await fetch(`${API_URL}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  console.log("[v0] Response status:", res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log("[v0] Error response:", errorText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function updateAttendance(id, status) {
  const res = await fetch(
    `${API_URL}/attendance/${id}?status=${status}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}
