from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
import crud

from database import SessionLocal, engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="HRMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://hrms-lite-bice-ten.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Root route
@app.get("/")
def home():
    return {"message": "HRMS API running 🚀"}


# Create employee
@app.post("/employees", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db=db, data=employee)


# Get all employees
@app.get("/employees", response_model=list[schemas.Employee])
def read_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)


# Get employee by ID
@app.get("/employees/{employee_id}", response_model=schemas.Employee)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    return crud.get_employee(db, employee_id)


# Delete employee
@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    return crud.delete_employee(db, employee_id)

@app.post("/attendance", response_model=schemas.Attendance)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    return crud.mark_attendance(db=db, data=attendance)


@app.get("/attendance", response_model=list[schemas.Attendance])
def read_attendance(db: Session = Depends(get_db)):
    return crud.get_attendance(db)
