import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiZap,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../api/api.js";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFieldErrors({
      email: "",
      password: "",
    });

    if (!formData.email) {
      toast.error("Email is required", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FEF2F2",
          color: "#DC2626",
          border: "1px solid #FCA5A5",
          padding: "16px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: <FiAlertCircle size={20} className="text-[#DC2626]" />,
      });
      setFieldErrors({ ...fieldErrors, email: "Email is required" });
      return;
    }

    if (!formData.password) {
      toast.error("Password is required", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FEF2F2",
          color: "#DC2626",
          border: "1px solid #FCA5A5",
          padding: "16px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: <FiAlertCircle size={20} className="text-[#DC2626]" />,
      });
      setFieldErrors({ ...fieldErrors, password: "Password is required" });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", formData);
      console.log("Login Response:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      console.log("Stored User:", localStorage.getItem("user"));
      toast.success(response.data.message || "Login Successful", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#F0FDF4",
          color: "#16A34A",
          border: "1px solid #86EFAC",
          padding: "16px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: <FiZap size={20} className="text-[#16A34A]" />,
      });

      setIsSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login Failed";
      if (errorMessage === "Invalid Email") {
        setFieldErrors({
          ...fieldErrors,
          email: "Account not found with this email"
        });

        toast.error("Account not found. Please check your email or register.", {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1px solid #FCA5A5",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
          },
          icon: <FiAlertCircle size={20} className="text-[#DC2626]" />,
        });
      }
      else if (errorMessage.includes("Invalid Password")) {
        setFieldErrors({
          ...fieldErrors,
          password: "Incorrect password. Please try again."
        });

        toast.error("Incorrect password. Please try again.", {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1px solid #FCA5A5",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
          },
          icon: <FiAlertCircle size={20} className="text-[#DC2626]" />,
        });
      }
      else {
        toast.error(errorMessage, {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1px solid #FCA5A5",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
          },
          icon: <FiAlertCircle size={20} className="text-[#DC2626]" />,
        });
      }
      setLoading(false);
    }
  };

  return (
    <>
      <main className="h-screen flex items-center justify-center bg-[#F4F7FC] px-4 relative overflow-hidden">
     
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#1A6BFF 1px, transparent 1px), linear-gradient(90deg, #1A6BFF 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Background Glow Effects */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#1A6BFF]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#1A6BFF]/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg border border-[#E3E9F4] relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center w-full mb-4"
          >
            <div className="flex-1 flex justify-end pr-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1A6BFF] to-[#4A8BFF] shadow-md shadow-[#1A6BFF]/25">
                <FiZap className="text-white" size={18} />
              </div>
            </div>
            <span className="font-display text-xl font-bold text-[#0A1A2F] shrink-0">VoltGrid</span>
            <div className="flex-1"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-center w-full flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold" style={{ color: "#000000" }}>Welcome Back</h2>
            <p className="text-sm text-[#45526E] mt-1 font-medium">Login to manage your charging stations</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-5 space-y-4"
          >
            <div className="relative">
              <label className="text-xs font-semibold text-[#45526E] ml-1 mb-1 block">
                Email Address
              </label>
              <div
                className={`relative rounded-lg border-2 transition-all duration-300 ${focused === "email"
                  ? "border-[#1A6BFF] shadow-md shadow-[#1A6BFF]/10"
                  : fieldErrors.email
                    ? "border-[#F87171] shadow-md shadow-[#F87171]/10"
                    : "border-[#E3E9F4]"
                  }`}
              >
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8695B3]" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full p-2.5 pl-10 rounded-lg bg-[#F8FAFC] text-[#0A1A2F] placeholder:text-[#8695B3] outline-none transition-colors text-sm"
                  required
                />
              </div>
              {fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-[#F87171] flex items-center gap-1"
                >
                  <FiAlertCircle size={12} /> {fieldErrors.email}
                </motion.p>
              )}
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-[#45526E] ml-1 mb-1 block">
                Password
              </label>
              <div
                className={`relative rounded-lg border-2 transition-all duration-300 ${focused === "password"
                  ? "border-[#1A6BFF] shadow-md shadow-[#1A6BFF]/10"
                  : fieldErrors.password
                    ? "border-[#F87171] shadow-md shadow-[#F87171]/10"
                    : "border-[#E3E9F4]"
                  }`}
              >
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8695B3]" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="w-full p-2.5 pl-10 pr-10 rounded-lg bg-[#F8FAFC] text-[#0A1A2F] placeholder:text-[#8695B3] outline-none transition-colors text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8695B3] hover:text-[#45526E] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-[#F87171] flex items-center gap-1"
                >
                  <FiAlertCircle size={12} /> {fieldErrors.password}
                </motion.p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[#1A6BFF] hover:text-[#0F4AC4] font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1A6BFF] to-[#4A8BFF] text-white py-2.5 rounded-lg font-bold shadow-lg shadow-[#1A6BFF]/30 hover:shadow-xl hover:shadow-[#1A6BFF]/40 transition-all disabled:opacity-70 disabled:hover:scale-100 mt-2 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isSuccess ? "Connecting to Grid..." : "Logging in..."}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login <FiArrowRight size={16} />
                </span>
              )}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center text-sm text-[#45526E] font-medium"
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#1A6BFF] font-bold hover:text-[#0F4AC4] transition-colors"
              >
                Register
              </Link>
            </motion.p>
          </motion.form>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-xs text-[#45526E] hover:text-[#1A6BFF] transition-colors inline-flex items-center gap-1 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default Login;