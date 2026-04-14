// ---------------------------------------------
// IMPORTS
// ---------------------------------------------
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize"); // ✅ IMPORTANT

const { User, Attendance, Leave } = require("./models");

const app = express();
const SECRET = "mysecretkey";

app.use(cors());
app.use(express.json());

// ---------------------------------------------
// ROOT
// ---------------------------------------------
app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});

// ---------------------------------------------
// CREATE DEFAULT USER
// ---------------------------------------------
const createUser = async () => {
  const existingUser = await User.findOne({ where: { username: "admin" } });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("1234", 10);

    await User.create({
      username: "admin",
      password: hashedPassword
    });

    console.log("Default user created: admin / 1234");
  }
};
createUser();

// ---------------------------------------------
// LOGIN
// ---------------------------------------------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ userId: user.id }, SECRET, {
    expiresIn: "15m"
  });

  res.json({ token });
});

// ---------------------------------------------
// VERIFY TOKEN
// ---------------------------------------------
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired or invalid" });
    }

    req.user = decoded;
    next();
  });
};

// ---------------------------------------------
// CHECK-IN (FINAL FIXED)
// ---------------------------------------------
app.post("/checkin", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await Attendance.findOne({
    where: {
      userId, // ✅ IMPORTANT
      date: {
        [Op.between]: [startOfDay, endOfDay]
      }
    }
  });

  if (existing) {
    return res.json({ message: "Already checked in today" });
  }

  const record = await Attendance.create({
    userId,
    date: new Date(),
    checkIn: new Date()
  });

  res.json(record);
});

// ---------------------------------------------
// CHECK-OUT (FINAL FIXED)
// ---------------------------------------------
app.post("/checkout", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const record = await Attendance.findOne({
    where: {
      userId,
      date: {
        [Op.between]: [startOfDay, endOfDay]
      }
    }
  });

  if (!record) {
    return res.json({ message: "Check-in first" });
  }

  record.checkOut = new Date();
  await record.save();

  res.json(record);
});

// ---------------------------------------------
// TIMESHEET
// ---------------------------------------------
app.get("/attendance", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  const data = await Attendance.findAll({
    where: { userId },
    order: [["date", "DESC"]]
  });

  res.json(data);
});

// ---------------------------------------------
// APPLY LEAVE
// ---------------------------------------------
app.post("/leave", verifyToken, async (req, res) => {
  const { startDate, endDate, reason, type } = req.body;
  const userId = req.user.userId;

  const leave = await Leave.create({
    userId,
    startDate,
    endDate,
    reason,
    type, // ✅ ADDED
    status: "Pending"
  });

  res.json(leave);
});

// ---------------------------------------------
// GET LEAVES
// ---------------------------------------------
app.get("/leave", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  const leaves = await Leave.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]]
  });

  res.json(leaves);
});

// ---------------------------------------------
// START SERVER
// ---------------------------------------------
app.listen(5000, () => {
  console.log("Server started on port 5000");
});