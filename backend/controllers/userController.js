const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  signup: async (req, res) => {
    const { username, email, phone, password, role } = req.body;
    if (!username || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const checkUser = await User.findByEmailOrPhone(email, phone);
      if (checkUser.rows.length > 0) {
        return res.status(400).json({ message: "Email or phone exists" });
      }
      await User.create({ username, email, phone, password, role });
      res.status(201).json({ message: "Registered Successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Fields can't be empty" });
    }
    try {
      const user = await User.findByEmail(email);
      if (user.rows.length === 0) {
        return res.status(400).json({ message: "User does not exist" });
      }
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const payload = {
        email: user.rows[0].email,
        role: user.rows[0].role,
        phonenumber: user.rows[0].phone,
      };
      const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "7d" });
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  changePassword: async (req, res) => {
    const { email, old_password, new_password } = req.body;

    if (!email || !old_password || !new_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const userResult = await User.findByEmail(email);
      const user = userResult.rows[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordMatch = await bcrypt.compare(old_password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      if (new_password.length < 8) {
        return res.status(400).json({ message: "Use stronger password" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(new_password, salt);
      await User.updatePassword(email, hashedNewPassword);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  updateUserPhoneNumber: async (req, res) => {
    const { email, new_phone_number } = req.body;

    if (!email || !new_phone_number)
      return res.status(400).json({ message: "Missing required fields" });

    if (!/^[9][0-9]{9}$/.test(new_phone_number))
      return res.status(400).json({ message: "Invalid phonenumber !" });

    try {
      const userResult = await User.findByEmail(email);
      const user = userResult.rows[0];

      if (!user) return res.status(404).json({ message: "User not found" });

      await User.updatePhoneNumber(email, new_phone_number);

      return res.status(200).json({ message: "Phone number updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  deleteUserAccount: async (req, res) => {
    const { email } = req.params;
    if (!email) return res.status(400).json({ message: "Email is required" });
    try {
      const userResult = await User.findByEmail(email);
      const user = userResult.rows[0];
      if (!user) return res.status(404).json({ message: "User not found" });
      await User.delete(email);
      return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getUserReservations: async (req, res) => {
    const { phone } = req.params;

    if (!/^[9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    try {
      const result = await User.findReservationsByPhone(phone);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  updateUserReservation: async (req, res) => {
    const { check_in_date, check_out_date, user_phone, room_id, reservation_id } = req.body;

    if (!check_in_date || !check_out_date || !user_phone || !room_id || !reservation_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const checkConflict = await User.checkReservationConflict(room_id, check_in_date, check_out_date, reservation_id);

      if (checkConflict.rows.length > 0) {
        return res.status(400).json({ message: "Unavailable for picked dates" });
      }
      await User.updateReservation(check_in_date, check_out_date, reservation_id);

      res.status(200).json({ message: "Updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = userController;