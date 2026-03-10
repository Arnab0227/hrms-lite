from sqlalchemy.orm import Session
import models


def create_employee(db: Session, data):
    emp = models.Employee(**data.dict())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

def get_employees(db: Session):
    return db.query(models.Employee).all()

def get_employee(db: Session, emp_id: int):
    return db.query(models.Employee).filter(models.Employee.id == emp_id).first()


def delete_employee(db: Session, emp_id):
    emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if emp:
        db.delete(emp)
        db.commit()


def mark_attendance(db: Session, data):

    record = models.Attendance(**data.dict())

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def get_attendance(db: Session):
    return db.query(models.Attendance).all()


def update_attendance(db: Session, attendance_id: int, status: str):
    record = db.query(models.Attendance).filter(models.Attendance.id == attendance_id).first()
    if record:
        record.status = status
        db.commit()
        db.refresh(record)
    return record
