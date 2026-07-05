import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiZap,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../api/api.js";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-[#F87171]";
    if (passwordStrength <= 2) return "bg-[#F59E0B]";
    if (passwordStrength <= 3) return "bg-[#10B981]";
    if (passwordStrength <= 4) return "bg-[#3B82F6]";
    return "bg-[#10B981]";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    if (passwordStrength <= 4) return "Strong";
    return "Very Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFieldErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    if (!formData.name.trim()) {
      toast.error("Full name is required", {
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
      setFieldErrors({ ...fieldErrors, name: "Full name is required" });
      return;
    }

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
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
      setFieldErrors({ ...fieldErrors, confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...submitData } = formData;
      const response = await api.post("/auth/register", submitData);

      toast.success(response.data.message || "User Registered Successfully", {
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
        icon: <FiCheckCircle size={20} className="text-[#16A34A]" />,
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration Failed";

      if (errorMessage === "Email already exists....!!" ||
        errorMessage.toLowerCase().includes("email already exists")) {

        setFieldErrors({
          ...fieldErrors,
          email: "This email is already registered. Please login or use another email."
        });

        toast.error("Email already exists. Please login or use a different email.", {
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
    } finally {
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
            className="flex items-center justify-center gap-2 mb-3 w-full"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1A6BFF] to-[#4A8BFF] shadow-md shadow-[#1A6BFF]/25 shrink-0">
              <FiZap className="text-white" size={18} />
            </div>
            <span className="font-display text-xl font-bold text-[#0A1A2F]">VoltGrid</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-center w-full flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold" style={{ color: "#000000" }}>Create Account</h2>
            <p className="text-sm text-[#45526E] mt-1 font-medium">Start managing your charging stations</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-4 space-y-3"
          >
            <div className="relative">
              <label className="text-xs font-semibold text-[#45526E] ml-1 mb-0.5 block">
                Full Name
              </label>
              <div
                className={`relative rounded-lg border-2 transition-all duration-300 ${focused === "name"
                  ? "border-[#1A6BFF] shadow-md shadow-[#1A6BFF]/10"
                  : fieldErrors.name
                    ? "border-[#F87171] shadow-md shadow-[#F87171]/10"
                    : "border-[#E3E9F4]"
                  }`}
              >
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8695B3]" size={16} />
                <input
                  type="text"
                  name="name"
                  placeholder="Alex Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className="w-full p-2 pl-10 rounded-lg bg-[#F8FAFC] text-[#0A1A2F] placeholder:text-[#8695B3] outline-none transition-colors text-sm"
                  required
                />
              </div>
              {fieldErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-[#F87171] flex items-center gap-1"
                >
                  <FiAlertCircle size={12} /> {fieldErrors.name}
                </motion.p>
              )}
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-[#45526E] ml-1 mb-0.5 block">
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
                  className="w-full p-2 pl-10 rounded-lg bg-[#F8FAFC] text-[#0A1A2F] placeholder:text-[#8695B3] outline-none transition-colors text-sm"
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
              <label className="text-xs font-semibold text-[#45526E] ml-1 mb-0.5 block">
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
                  className="w-full p-2 pl-10 pr-10 rounded-lg bg-[#F8FAFC] text-[#0A1A2F] placeholder:text-[#8695B3] outline-none transition-colors text-sm"
                  required
                  minLength={6}
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

              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-1.5 space-y-0.5"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < passwordStrength ? getStrengthColor() : "bg-[#E3E9F4]"
                          }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span
                      className={`font-medium ${passwordStrength <= 1
                        ? "text-[#F87171]"
                        : passwordStrength <= 2
                          ? "text-[#F59E0B]"
                          : passwordStrength <= 3
                            ? "text-[#10B981]"
                            : passwordStrength <= 4
                              ? "text-[#1A6BFF]"
                              : "text-[#10B981]"
                        }`}
                    >
                      {getStrengthText()}
                    </span>
                    <span className="text-[#8695B3]">{formData.password.length} chars</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-[#45526E] ml-1 mb-0.5 block">
                Confirm Password
              </label>
              <div
                className={`relative rounded-lg border-2 transition-all duration-300 ${focused === "confirmPassword"
                  ? "border-[#1A6BFF] shadow-md shadow-[#1A6BFF]/10"
                  : fieldErrors.confirmPassword
                    ? "border-[#F87171] shadow-md shadow-[#F87171]/10"
                    : "border-[#E3E9F4]"
                  } ${formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? "border-[#F87171]"
                    : ""
                  }`}
              >
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8695B3]" size={16} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused("confirmPassword")}
                  onBlur={() => setFocused(null)}
                  className="w-full p-2 pl-10 pr-10 rounded-lg bg-[#F8FAFC] text-[#0A1A2F] placeholder:text-[#8695B3] outline-none transition-colors text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8695B3] hover:text-[#45526E] transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-[#F87171] flex items-center gap-1"
                >
                  <FiAlertCircle size={12} /> {fieldErrors.confirmPassword}
                </motion.p>
              )}
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                formData.password.length >= 6 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-[#10B981] flex items-center gap-1"
                  >
                    <FiCheckCircle size={12} /> Passwords match
                  </motion.p>
                )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1A6BFF] to-[#4A8BFF] text-white py-2.5 rounded-lg font-bold shadow-lg shadow-[#1A6BFF]/30 hover:shadow-xl hover:shadow-[#1A6BFF]/40 transition-all disabled:opacity-70 disabled:hover:scale-100 mt-1 text-sm"
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
                  Creating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <FiArrowRight size={16} />
                </span>
              )}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-center text-sm text-[#45526E] font-medium"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#1A6BFF] font-bold hover:text-[#0F4AC4] transition-colors"
              >
                Login
              </Link>
            </motion.p>
          </motion.form>

          <div className="mt-3 text-center">
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

export default Register;