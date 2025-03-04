import React, { useState } from "react";
import axios from "axios";
import { useSession } from "../Context/SessionContext";

const UserProfile = () => {
  const { sessionData } = useSession();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(sessionData?.phonenumber);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);
  const handleNewPasswordToggle = () => setShowNewPassword((prev) => !prev);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^9\d{9}$/; 
    return phoneRegex.test(number);
  };
  
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3008/users/user-delete-account/${sessionData?.email}`);
        window.success("Account deleted !");
        window.location.href = "../../logout";
      } catch (error) {
        window.failure("Failed to delete account");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!password || !newPassword) {
      window.failure("Both password required!");
      return;
    }
    if (!validatePassword(newPassword)) {
      window.failure("Use stronger password");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:3008/users/user-change-password", {
        email: sessionData?.email,
        old_password: password,
        new_password: newPassword,
      });
      window.success("Updated successfully!");
    } catch (error) {
      window.failure(error?.response?.data?.message || "Failed to change password!");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = async () => {
    if (!phoneNumber) {
      window.failure("Invalid phonenumber!");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      window.failure("Invalid phonenumber !");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3008/users/update-user-phonenumber", {
        email: sessionData?.email,
        new_phone_number: phoneNumber,
      });
      window.success("Updated successfully!");
    } catch (error) {
      window.failure(error?.response?.data?.message || "Failed to update!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uep-user-profile-container">
      <h3>My Profile</h3>
      
      <div className="uep-profile-info">
        <label>Email</label>
        <div className="uep-readonly-input">
          <i className="ri-mail-line"></i> {sessionData?.email}
        </div>
      </div>

      <div className="uep-phone-number-change">
        <label>Phone Number</label>
        <div className="uep-phone-input">
          <input
            className="uep-input"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter new phone number"
          />
        </div>

        <button className="uep-button" onClick={handlePhoneNumberChange} disabled={loading}>
          {loading ? "Updating..." : "Update Phone Number"}
        </button>
      </div>

      <div className="uep-password-change">
        <label>Old Password</label>
        <div className="uep-password-input">
          <input
            className="uep-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter old password"
          />
          <span onClick={handlePasswordToggle}>
            {showPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
          </span>
        </div>

        <label>New Password</label>
        <div className="uep-password-input">
          <input
            className="uep-input"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <span onClick={handleNewPasswordToggle}>
            {showNewPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
          </span>
        </div>

        <button className="uep-button" onClick={handlePasswordChange} disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>

      <div className="uep-delete-account">
        <div className="uep-delete-warning">
          Deleting your account will permanently remove all your data and you won't be able to recover it. Are you sure?
        </div>
        <button className="uep-delete-button" onClick={handleDeleteAccount} disabled={loading}>
          <i className="ri-delete-bin-line"></i> {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
