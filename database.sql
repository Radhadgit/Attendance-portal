-- ---------------------------------------------
-- CREATE DATABASE
-- ---------------------------------------------
CREATE DATABASE attendance_db;

-- Use the database
\c attendance_db;

-- ---------------------------------------------
-- USERS TABLE
-- ---------------------------------------------
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------
-- ATTENDANCE TABLE
-- ---------------------------------------------
CREATE TABLE "Attendances" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    "checkIn" TIMESTAMP,
    "checkOut" TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------
-- LEAVE TABLE
-- ---------------------------------------------
CREATE TABLE "Leaves" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);