// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
    addAppointment,
    deleteAppointment,
    getAllAppointments
} = require("../controllers/Appointment")

const {auth, isUser, isDoctor} = require("../middleware/auth")

function isDoctororUser(req, res, next) {
    if (req.user && (req.user.accountType === 'User' || req.user.accountType === 'Doctor')) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access: Doctor and User rights required'
    });
  }

router.post("/addAppointment", auth, isUser, addAppointment);
router.delete("/deleteAppointment", auth, isUser, deleteAppointment)

router.get("/getAllAppointments",auth, isDoctororUser, getAllAppointments )

module.exports = router