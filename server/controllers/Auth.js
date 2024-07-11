const User = require("../models/User");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


require("dotenv").config();

// SignUp controller for registering Users
exports.signUp = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            accountType,
        } = req.body;

        // validations
        if (!name || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            })
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status().json({
                success: false,
                message: "User already exists, Please login to continue"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // create the user
        let approved = "";
        approved === "Owner" ? (approved = false) : (approved = true);

       

        const user = await User.create({
           name,
            email,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        })

        // return res
        return res.status(200).json({
            success: true,
            message: "User has been successfully registered",
            user,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User can not be registered. Please try again",
        })
    }
};


// Login controller for authenticating users
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Fill up All Required Fields",
            });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not Registered with us, Please SignUp to Continue",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            // Save token to user document in database
            user.token = token;
            user.password = undefined;
            // console.log(token)

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in successfully",
            })
        }

        else {
            return res.status(401).json({
                success: false,
                message: "Password is Incorrect",
            });
        }
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, please try again after some time",
        })
    }
};

// controller for reset Password
// exports.resetPassword = async (req, res) => {
//     const { email, password, resetToken } = req.body;

//     // Validate inputs
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         // Verify reset token
//         const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Update password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user.password = hashedPassword;
//         user.resetToken = undefined;
//         await user.save();

//         // Respond with success message
//         return res.status(200).json({ success: true, message: "Password reset successfully" });
//     } catch (err) {
//         console.error(err.message);
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ message: "Invalid or expired token. Please request a new reset link." });
//         }
//         return res.status(500).json({ message: "Password reset failed. Please try again later." });
//     }
// };
//         const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Update password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user.password = hashedPassword;
//         user.resetToken = undefined;
//         await user.save();

//         // Respond with success message
//         return res.status(200).json({ success: true, message: "Password reset successfully" });
//     } catch (err) {
//         console.error(err.message);
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ message: "Invalid or expired token. Please request a new reset link." });
//         }
//         return res.status(500).json({ message: "Password reset failed. Please try again later." });
//     }
// };