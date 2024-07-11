const express = require("express");
const app = express();
const mongoose = require("mongoose")
const userRoutes = require("./routes/User");
const appointmentRoutes = require("./routes/Appointment");
// const adminRoutes = require("./routes/Admin")
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;

dotenv.config();

database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use("/api/auth", userRoutes);
app.use("/api/appointment", appointmentRoutes);
// app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});