from pydantic import BaseModel, EmailStr
from datetime import date


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class Employee(EmployeeCreate):
    id: int

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str


class Attendance(AttendanceCreate):
    id: int

    class Config:
        from_attributes = True
