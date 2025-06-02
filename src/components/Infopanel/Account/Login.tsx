import React, { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from 'contexts/UserContext';

const Login: React.FC = () => {
  const [forgottenPassword, setForgottenPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false); // New state for reset password form
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [type, setType] = useState('password');
  const params = new URLSearchParams(window.location.search);
  const resetpasswordtoken = params.get('token');
  const { setUserId } = useUser();
  useEffect(() => {
    // Reset states on page reload
    setForgottenPassword(false);
    setResetPassword(false);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('resetPassword') === 'true') {
      setResetPassword(true);
    }
  }, []);
  useEffect(() => {
    if (forgottenPassword) {
      console.log("Switched to forgotten password form");
    } else if (resetPassword) {
      console.log("Switched to reset password form");
    } else {
      console.log("Switched to login form");
    }
  }, [forgottenPassword, resetPassword]);

  const handleForgottenPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cooldownKey = 'resetPasswordCooldown';
    const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const lastAttempt = localStorage.getItem(cooldownKey);
    const now = Date.now();
    if (lastAttempt && now - parseInt(lastAttempt, 10) < cooldownTime) {
      toast.error("Please wait a few minutes before trying again.");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }
      toast.success("Password reset link sent to your email!");
      localStorage.setItem(cooldownKey, now.toString()); // Store the timestamp of the attempt
      setForgottenPassword(false); // Switch back to login form
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(resetpasswordtoken);
    console.log(formData.password);
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/setnewpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: formData.password, token:resetpasswordtoken}),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }
      if (data.redirectUrl) {
        toast.success("Password reset successful! You can now log in.");
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 2000);
    }
      setResetPassword(false); // Switch back to login form
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      //localStorage.setItem("token", data.token);
      //window.dispatchEvent(new Event("storage"));
      setUserId(data.userId); // Set userId in context
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = () => {
    setType(type === 'password' ? 'text' : 'password');
  };

  return (
    <div>
      <Toaster />
      {!forgottenPassword && !resetPassword ? (
        <div>
          {/* Login Form */}
          <form method="post" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="mb-4 flex">
                <input
                  name="password"
                  type={type}
                  id="password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span
                  className="border border-gray-300 rounded cursor-pointer"
                  title="show/hide"
                  onClick={handleToggle}
                >
                  {type === "password" ? <FiEye className="custom-class" /> : <FiEyeOff className="custom-class" />}
                </span>
              </div>
            </div>
            <div className="mb-4 text-right">
              <a
                onClick={() => setForgottenPassword(true)}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Did you forget your password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Login
            </button>
          </form>
        </div>
      ) : forgottenPassword ? (
        <div>
          {/* Forgotten Password Form */}
          <form method="post" onSubmit={handleForgottenPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Enter your email to receive a password reset link:
              </label>
              <input
                name="email"
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Send Reset Link
            </button>
            <div className="mt-4 text-right">
              <a
                onClick={() => setForgottenPassword(false)}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {/* Reset Password Form */}
          <form method="post" onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                name="password"
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your new password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Reset Password
            </button>
            <div className="mt-4 text-right">
              <a
                onClick={() => setResetPassword(false)}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;