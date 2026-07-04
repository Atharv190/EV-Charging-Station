import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiZap, FiMapPin, FiActivity } from "react-icons/fi";
import api from "../api/api";
import toast from "react-hot-toast";

const CONNECTOR_TYPES = ["Type 1", "Type 2", "CCS", "CCS2", "CHAdeMO", "GB/T", "Tesla"];
const STATUS_OPTIONS = ["Active", "Inactive", "Maintenance"];

export default function EditStationModal({ isOpen, onClose, station, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        status: "Active",
        powerOutput: "",
        connectorType: "CCS2",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (station && isOpen) {
            setFormData({
                name: station.name || "",
                location: station.location || "",
                status: station.status || "Active",
                powerOutput: station.powerOutput || "",
                connectorType: station.connectorType || "CCS2",
            });
        }
    }, [station, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.put(`/stations/${station._id}`, formData);
            await new Promise(r => setTimeout(r, 600)); // Artificial delay for UX
            toast.success("Station successfully updated", {
                style: { background: "#ffffff", color: "#0f172a", border: "1px solid #10b981", borderRadius: "1rem" },
                icon: "✅"
            });
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update station", {
                style: { background: "#ffffff", color: "#0f172a", border: "1px solid #fecdd3", borderRadius: "1rem", fontWeight: "bold" }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50 p-4"
                    >
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-teal-400/20 rounded-full blur-[80px] pointer-events-none z-[-1]" />
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none z-[-1]" />

                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white max-h-[85vh] overflow-y-auto relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "Space Grotesk" }}>Edit Station</h2>
                                    <p className="text-sm font-semibold text-slate-500 mt-1">Update module configuration for <span className="text-teal-600 font-bold">{station?.name}</span></p>
                                </div>
                                <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-rose-600 rounded-xl transition-all shadow-inner">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Station Name</label>
                                        <div className="relative group">
                                            <FiZap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all shadow-inner" />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Location String</label>
                                        <div className="relative group">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all shadow-inner" />
                                        </div>
                                    </div>

                                    {/* Power Output */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Power (kW)</label>
                                        <div className="relative group">
                                            <FiActivity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                            <input type="number" name="powerOutput" value={formData.powerOutput} onChange={handleChange} required min="1" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all shadow-inner" />
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Live Status</label>
                                        <div className="relative group h-full">
                                            <select name="status" value={formData.status} onChange={handleChange} className="w-full h-[48px] px-4 bg-slate-50 border border-slate-200/60 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-bold text-slate-800 transition-all shadow-inner appearance-none cursor-pointer">
                                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Connector Type */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Hardware Protocol</label>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {CONNECTOR_TYPES.map((type) => (
                                                <button key={type} type="button" onClick={() => setFormData({ ...formData, connectorType: type })} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.connectorType === type ? "bg-teal-50 border-teal-500 text-teal-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-inner disabled:opacity-50">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 rounded-xl font-bold text-sm bg-teal-500 hover:bg-teal-600 text-white shadow-[0_4px_15px_rgb(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-75 disabled:hover:scale-100 min-w-[160px]">
                                        {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : <><FiCheck size={18} /> Update Station</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
