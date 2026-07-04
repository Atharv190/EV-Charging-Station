import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiMapPin,
  FiZap,
  FiCpu,
  FiCheckCircle,
  FiEdit3,
  FiGlobe,
  FiPower,
  FiLink,
  FiMap,
  FiChevronRight,
  FiChevronLeft,
  FiCheck,
  FiLoader,
  FiHome,
  FiChevronDown,
  FiActivity,
  FiEye,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";

// --- Configuration & Constants ---
const CONNECTOR_TYPES = ["Type 1", "Type 2", "CCS", "CCS2", "CHAdeMO", "GB/T", "Tesla"];
const STATUS_OPTIONS = ["Active", "Inactive", "Maintenance"];

const STATUS_STYLES = {
  Active: { dot: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-100", ring: "ring-teal-500/30 border border-teal-200" },
  Inactive: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-100", ring: "ring-rose-500/30 border border-rose-200" },
  Maintenance: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-100", ring: "ring-amber-500/30 border border-amber-200" },
};

// --- Subcomponents ---

const SuccessOverlay = ({ show, name, onRedirect }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl p-6 sm:p-8 max-w-[95vw] sm:max-w-sm w-full text-center shadow-2xl border border-slate-200 relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-teal-50 mx-auto flex items-center justify-center mb-5 border border-teal-100 relative z-10">
            <FiCheck size={40} className="text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2 relative z-10" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>EV Station Added! 🎉</h2>
          <p className="text-slate-500 text-sm mb-4 relative z-10">{name || 'Your new EV station'} has been successfully added to the network.</p>

          <div className="mt-5 flex flex-col items-center relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Redirecting to Dashboard</span>
            <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 1.5, ease: "linear" }} onAnimationComplete={onRedirect} className="h-full w-full bg-teal-500" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const LoadingOverlay = ({ loading, showSuccess }) => (
  <AnimatePresence>
    {loading && !showSuccess && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 flex flex-col items-center max-w-[280px] w-full text-center">
          <div className="relative mb-4 mt-2">
            <div className="w-14 h-14 rounded-full border-[3px] border-slate-100" />
            <div className="absolute inset-0 rounded-full border-[3px] border-t-teal-500 border-r-teal-500 animate-spin" />
            <FiZap className="absolute inset-0 m-auto text-teal-500" size={20} />
          </div>
          <p className="text-black font-bold text-lg" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>Adding EV Station...</p>
          <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Please wait</p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const StepIndicator = ({ step, steps }) => (
  <div className="flex items-center justify-between mb-8 px-2 relative z-10">
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200/60 rounded-full -z-10" />
    <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 rounded-full -z-10" initial={{ width: "0%" }} animate={{ width: step === 1 ? "0%" : "100%" }} transition={{ duration: 0.3, ease: "easeInOut" }} />

    {steps.map((s) => {
      const active = step >= s.id;
      return (
        <div key={s.id} className="flex flex-col items-center relative gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${active ? "bg-teal-500 text-white shadow-md" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
            {step > s.id ? <FiCheck size={18} /> : <s.icon size={18} />}
          </div>
          <div className="absolute -bottom-5 w-max text-center">
            <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${active ? "text-slate-800" : "text-slate-400"}`}>{s.label}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const LivePreviewCard = ({ preview }) => {
  const st = STATUS_STYLES[preview.status] || STATUS_STYLES.Inactive;
  const isSetup = preview.hasCoords;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 h-fit lg:sticky lg:top-24 flex flex-col relative overflow-hidden">

      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-2">
          <FiEye size={14} className="text-teal-600" />
          <h2 className="text-[11px] font-bold text-black uppercase tracking-widest" style={{ color: "#000000" }}>Live Preview</h2>
        </div>
        <div className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Preview Data</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative z-10 shadow-inner">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-teal-600 shadow-sm">
            <FiZap size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-base truncate" style={{ fontFamily: "Space Grotesk" }}>{preview.name || "Unnamed EV Station"}</p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono font-medium flex items-center gap-1">
              <FiLink className="text-teal-500" size={10} /> {preview.connector} Connector
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><FiPower className="text-amber-500" /> Power</span>
            <span className="font-bold text-slate-800 text-sm">{preview.power ? `${preview.power} kW` : "—"}</span>
          </div>
          <div className="flex flex-col bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center justify-between">Status <span className={`w-2 h-2 rounded-full ${st.dot}`} /></span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 truncate">{preview.status}</span>
          </div>
          <div className="flex flex-col sm:col-span-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><FiMapPin className="text-rose-400" /> Location Area</span>
            <span className="font-bold text-slate-800 text-[11px] truncate">{preview.location || "Awaiting location..."}</span>
          </div>
        </div>

        {/* Dynamic Map Window */}
        <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-200 aspect-[16/8] flex items-center justify-center shadow-inner group">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          {isSetup ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center relative z-10 transition-transform group-hover:scale-105">
              <FiMapPin className="text-rose-500 drop-shadow-md mb-1" size={24} />
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                <p className="text-[10px] font-mono text-slate-800 font-bold tracking-wider">{preview.lat}° N, {preview.lng}° E</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-slate-500 relative z-10">
              <FiGlobe size={24} className="mb-2 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Provide Coordinates</span>
            </div>
          )}
        </div>
      </div>

      {!isSetup && (
        <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-teal-700 text-[10px] font-bold flex items-start gap-2 shadow-sm relative z-10">
          <FiCheckCircle size={14} className="mt-0.5 shrink-0 text-emerald-500" />
          <span className="leading-relaxed">Add coordinates to automatically snap the station onto the network map.</span>
        </div>
      )}
    </motion.div>
  );
};


// --- Main Page Component ---

function AddStation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [formData, setFormData] = useState({
    name: "", location: "", latitude: "", longitude: "", powerOutput: "", connectorType: "CCS", status: "Active"
  });

  const [touched, setTouched] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const getErrors = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "EV station name is required.";
    if (!formData.location.trim()) errs.location = "City or geographic area is required.";

    const lat = Number(formData.latitude);
    if (!formData.latitude || isNaN(lat) || lat < -90 || lat > 90) errs.latitude = "Valid bounds: -90° to 90°.";

    const lng = Number(formData.longitude);
    if (!formData.longitude || isNaN(lng) || lng < -180 || lng > 180) errs.longitude = "Valid bounds: -180° to 180°.";

    const pwr = Number(formData.powerOutput);
    if (!formData.powerOutput || isNaN(pwr) || pwr <= 0) errs.powerOutput = "Power output must be positive.";

    return errs;
  };

  const errors = getErrors();
  const isStep1Valid = !errors.name && !errors.location && !errors.latitude && !errors.longitude;
  const isStep2Valid = !errors.powerOutput;

  const nextStep = () => {
    setTouched({ name: true, location: true, latitude: true, longitude: true });
    if (isStep1Valid) setStep(2);
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, location: true, latitude: true, longitude: true, powerOutput: true });
    if (!isStep1Valid || !isStep2Valid) return;

    try {
      setLoading(true);
      const loadingToast = toast.loading("Adding EV station...", {
        style: { background: "#ffffff", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: "1rem" },
      });

      await api.post("/stations", {
        ...formData,
        name: formData.name.trim(),
        location: formData.location.trim(),
        powerOutput: Number(formData.powerOutput),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });

      toast.dismiss(loadingToast);
      setShowSuccessOverlay(true);
    } catch (error) {
      toast.dismiss();
      const msg = error.response?.data?.message || "Failed to add EV station. Please retry.";
      toast.error(msg, {
        duration: 4000,
        style: { background: "#ffffff", color: "#0f172a", border: "1px solid #fecdd3", borderRadius: "1rem", fontWeight: "bold" },
      });
    } finally {
      setLoading(false);
    }
  };

  const previewData = {
    name: formData.name,
    location: formData.location,
    lat: formData.latitude ? parseFloat(formData.latitude).toFixed(4) : null,
    lng: formData.longitude ? parseFloat(formData.longitude).toFixed(4) : null,
    hasCoords: formData.latitude && formData.longitude && !errors.latitude && !errors.longitude,
    power: formData.powerOutput,
    connector: formData.connectorType,
    status: formData.status,
  };

  const steps = [
    { id: 1, label: "Location Setup", icon: FiMapPin },
    { id: 2, label: "Hardware Specs", icon: FiCpu },
  ];

  const getInputClasses = (name) => `w-full pl-10 pr-4 py-2.5 bg-slate-50 border shadow-inner rounded-xl outline-none transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium ${touched[name] && errors[name] ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white' : 'border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white hover:border-slate-300'}`;
  const getIconClasses = (name) => `absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${touched[name] && errors[name] ? 'text-rose-400' : 'text-slate-400'}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 relative font-sans selection:bg-teal-500/30 overflow-hidden">

      {/* Subtle dot background pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <LoadingOverlay loading={loading} showSuccess={showSuccessOverlay} />
      <SuccessOverlay show={showSuccessOverlay} name={formData.name} onRedirect={() => navigate('/viewstations')} />

      <div className="max-w-[1000px] mx-auto relative pt-2 z-10 pb-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 hover:text-teal-600 transition-colors group mb-6 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm w-fit">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
          Return to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-teal-600">
              <FiZap size={24} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>
                Add EV Station
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Deploy and configure a new EV charging station.</p>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto lg:max-w-none lg:mx-0">
          <div className="px-2">
            <StepIndicator step={step} steps={steps} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-7 xl:col-span-8 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                          EV Station Name
                        </label>
                        <div className="relative group">
                          <FiEdit3 className={getIconClasses('name')} size={16} />
                          <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. NeoHub Central EV Node" className={getInputClasses('name')} />
                        </div>
                        {touched.name && errors.name ? <p className="text-xs text-rose-500 mt-1.5 font-bold px-1">{errors.name}</p> : <p className="mt-1.5 text-[11px] font-semibold text-slate-400 px-1">Provide a distinct identifier for the dashboard.</p>}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                          City / Area
                        </label>
                        <div className="relative group">
                          <FiHome className={getIconClasses('location')} size={16} />
                          <input type="text" name="location" value={formData.location} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Sector 7G, Metropolis" className={getInputClasses('location')} />
                        </div>
                        {touched.location && errors.location ? <p className="text-xs text-rose-500 mt-1.5 font-bold px-1">{errors.location}</p> : <p className="mt-1.5 text-[11px] font-semibold text-slate-400 px-1">Readable geographic descriptor for the users.</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm relative group hover:border-slate-300 transition-colors">
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-2">Latitude Coordinates</label>
                          <div className="relative z-10">
                            <FiGlobe className={getIconClasses('latitude')} size={14} />
                            <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} onBlur={handleBlur} placeholder="40.7128" className={getInputClasses('latitude')} />
                          </div>
                          {touched.latitude && errors.latitude && <p className="text-[10px] text-rose-500 mt-1.5 font-bold">{errors.latitude}</p>}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm relative group hover:border-slate-300 transition-colors">
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-2">Longitude Coordinates</label>
                          <div className="relative z-10">
                            <FiGlobe className={getIconClasses('longitude')} size={14} />
                            <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} onBlur={handleBlur} placeholder="-74.0060" className={getInputClasses('longitude')} />
                          </div>
                          {touched.longitude && errors.longitude && <p className="text-[10px] text-rose-500 mt-1.5 font-bold">{errors.longitude}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-2">
                            <FiPower size={12} className="text-teal-600" /> Max Power Output (kW)
                          </label>
                          <div className="relative">
                            <FiActivity className={getIconClasses('powerOutput')} size={14} />
                            <input type="number" name="powerOutput" value={formData.powerOutput} onChange={handleChange} onBlur={handleBlur} placeholder="250" className={getInputClasses('powerOutput')} />
                          </div>
                          {touched.powerOutput && errors.powerOutput && <p className="text-xs text-rose-500 mt-1.5 font-bold px-1">{errors.powerOutput}</p>}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-2">
                            <FiLink size={12} className="text-teal-600" /> Connector Standard
                          </label>
                          <div className="relative">
                            <FiZap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select name="connectorType" value={formData.connectorType} onChange={handleChange} className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none appearance-none shadow-inner text-slate-800 text-sm font-bold cursor-pointer">
                              {CONNECTOR_TYPES.map(type => <option key={type}>{type}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                              <FiChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden">
                        <label className="block text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>Initial Ev Station Status</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {STATUS_OPTIONS.map((status) => {
                            const active = formData.status === status;
                            const stStyle = STATUS_STYLES[status] || STATUS_STYLES.Inactive;

                            return (
                              <label key={status} className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${active ? "border-teal-500 bg-white shadow-sm scale-[1.02] z-10" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                                <input type="radio" name="status" value={status} checked={active} onChange={handleChange} className="hidden" />
                                <span className={`w-2.5 h-2.5 rounded-full ${active ? stStyle.dot : 'bg-slate-300'}`} />
                                <span className={`font-bold text-xs tracking-wide ${active ? 'text-teal-700' : ''}`}>{status}</span>
                                {active && <motion.div layoutId="statusRing" className="absolute inset-0 border-2 border-teal-500 rounded-xl" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0 pt-6 mt-6 border-t border-slate-200">
                  <button type="button" onClick={prevStep} className={`w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all pb-[11px] ${step === 1 ? "hidden sm:invisible sm:flex" : ""}`}>
                    <FiChevronLeft size={16} /> Location Fix
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {step === 2 ? (
                      <button type="submit" disabled={loading || !isStep2Valid} className="w-full sm:w-auto justify-center px-6 py-2.5 bg-teal-600 text-white text-sm font-bold tracking-wide rounded-xl shadow-sm hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {loading ? <><FiLoader className="animate-spin" size={16} /> Adding Station...</> : <><FiCheck size={16} /> Add EV Station</>}
                      </button>
                    ) : (
                      <button type="button" onClick={nextStep} disabled={!isStep1Valid && (touched.name && touched.location && touched.latitude && touched.longitude)} className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold tracking-wide rounded-xl shadow-sm hover:opacity-80 transition-all disabled:opacity-50 leading-tight">
                        Hardware Specs <FiChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>

            <div className="lg:col-span-5 xl:col-span-4">
              <LivePreviewCard preview={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStation;