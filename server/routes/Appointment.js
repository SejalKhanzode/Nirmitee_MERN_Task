// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
    addAppointment,
    deleteAppointment,
    getAllAppointments
} = require("../controllers/Appointment")

const {auth,isReceptionist, isAdmin, isDoctor} = require("../middleware/auth")

function isReceptionistorDoctor(req, res, next) {
    if (req.user && (req.user.accountType === 'Receptionist' || req.user.accountType === 'Doctor')) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access: Receptionist or Doctor rights required'
    });
  }

router.post("/addAppointment", auth, isReceptionist, addAppointment);
router.delete("/deleteAppointment", auth, isReceptionist, deleteAppointment)

router.get("/getAllAppointments", auth, isReceptionistorDoctor, getAllAppointments )

module.exports = router