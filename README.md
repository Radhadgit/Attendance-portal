# Employee Attendance Portal

## 📌 Overview

This is a full-stack web application that allows employees to:

* Login securely using username and password
* Mark daily check-in and check-out
* View attendance history (timesheet)
* Apply for leave and track status

This project is built as per the assignment requirements using React, Node.js, and PostgreSQL.

---

## 🛠 Tech Stack

### Frontend

* React.js
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JWT Authentication
* Sequelize ORM

### Database

* PostgreSQL

---

## 🔐 Authentication & Session Management

* JWT-based authentication is implemented
* Token expires after **15 minutes**
* All protected APIs require a valid token
* On token expiry, user is redirected to login page

---

## 📂 Project Structure

attendance-portal/
│
├── frontend/       → React application
├── backend/        → Node.js + Express API
├── database.sql    → Database schema
├── README.md       → Project documentation

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Project

```bash
git clone <your-repository-link>
cd attendance-portal
```

---

### 2️⃣ Setup PostgreSQL Database

Create database:

```sql
CREATE DATABASE attendance_db;
```

Run SQL file:

```bash
psql -U postgres -d attendance_db -f database.sql
```

---

### 3️⃣ Backend Setup

```bash
cd backend
npm install
```

Update database configuration in:
`backend/config/config.json`

```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "attendance_db",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

Run migrations (if used):

```bash
npx sequelize-cli db:migrate
```

Start backend server:

```bash
node app.js
```

Backend runs on:
http://localhost:5000

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:
http://localhost:3000

---

## 🚀 Features

### 🔑 Login Page

* User authentication using username & password
* Displays error for invalid credentials

---

### 🟢 Check-in / Check-out

* Employee can check in once per day
* Cannot check in multiple times on the same day
* Can check out after checking in
* Status displayed:

  * Not checked in
  * Checked in
  * Checked out

---

### 📊 Timesheet Page

* Displays attendance history
* Shows:

  * Date
  * Check-in time
  * Check-out time

---

### 📝 Apply Leave Page

* Submit leave request with:

  * Start date
  * End date
  * Reason
* View all leave requests
* Status shown (Pending)

---

## ⚠️ Constraints Implemented

* Session expires after **15 minutes**
* Only **one check-in per day allowed**
* Data is user-specific (no data leakage)

---

## 👤 Default User

Username: admin
Password: 1234

---

## 📌 Important Notes

* Make sure PostgreSQL service is running
* Ensure correct DB credentials in config file
* Backend must run before frontend
* Token expiry will automatically log out the user

---

## 📦 Submission Files

* frontend.zip
* backend.zip
* database.sql
* README.md
