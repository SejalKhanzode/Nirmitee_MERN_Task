const Appointment = require("../models/Appointment");
const User = require('../models/User');

// Controller to add a new appointment
exports.addAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { patientName, dateTime, duration } = req.body;

    if (!patientName || !dateTime || !duration) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    // Find the user by userId and accountType 'Receptionist'
    const userDetails = await User.findById(userId);
    //   console.log(userId)
    if (
      !userDetails ||
      !(userDetails.accountType === "User")
    ) {
      return res.status(404).json({
        success: false,
        message: "Only User can Add Appointment",
      });
    }

    // Create a new Appointment
    const newAppointment = await Appointment.create({
      patientName,
      dateTime,
      duration,
    });

    // Return success response
    res.status(200).json({
      success: true,
      data: newAppointment,
      message: "Appointment Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create Appointment",
    });
  }
};

// Controller to delete an appointment
exports.deleteAppointment = async (req, res) => {
  try { 
    const { id } = req.body;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false, message: err.message });
  }
};

// Controller to fetch all appointments
exports.getAllAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find().sort({ dateTime: 1 });
  
      // Log appointments to check if data is retrieved correctly
      console.log('Fetched Appointments:', appointments);
  
      return res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };