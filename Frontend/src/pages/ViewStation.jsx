import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import EditStationModal from "../components/EditStationModal";
import toast from "react-hot-toast";
import {
  FiEdit, FiTrash2, FiSearch, FiMapPin, FiPlus,
  FiFilter, FiX, FiAlertTriangle, FiActivity, FiZap,
  FiAlertOctagon, FiUser, FiPower, FiChevronDown, FiArrowLeft
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";

const CONNECTOR_TYPES = ["Type 1", "Type 2", "CCS", "CCS2", "CHAdeMO", "GB/T", "Tesla"];
const STATUS_OPTIONS = ["Active", "Inactive", "Maintenance"];

const STATUS_STYLES = {
  Active: { dot: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-50", ring: "border-teal-200/60" },
  Inactive: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50", ring: "border-rose-200/60" },
  Maintenance: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", ring: "border-amber-200/60" },
};

const safeParse = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};

const StatusBadge = ({ status }) => {
  const st = STATUS_STYLES[status] || STATUS_STYLES.Inactive;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${st.bg} ${st.text} ${st.ring} shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]`}>
      <span className={`w-2 h-2 rounded-full ${st.dot} shadow-sm`} />
      {status}
    </span>
  );
};

const DeleteModal = ({ isOpen, onClose, onConfirm, stationName, isLoading }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-red-500" />
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-5 border border-rose-100 shadow-sm relative z-10">
            <FiAlertTriangle className="text-rose-500" size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight" style={{ fontFamily: "Space Grotesk" }}>Delete Station?</h3>
          <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed relative z-10">Are you absolutely sure you want to permanently remove <span className="text-slate-800 font-bold">{stationName}</span>? This action cannot be reversed.</p>
          <div className="flex gap-4 relative z-10">
            <button onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-3 bg-slate-100/80 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors shadow-sm disabled:opacity-50">Cancel</button>
            <button onClick={onConfirm} disabled={isLoading} className="flex-1 px-4 py-3 bg-gradient-to-br from-rose-500 to-red-600 text-white font-bold text-sm rounded-xl hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none">
              {isLoading ? <FiActivity className="animate-spin" size={18} /> : <FiTrash2 size={18} />}
              {isLoading ? "Deleting..." : "Delete Node"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const EmptyState = ({ isFiltered, clearFilters }) => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
      {isFiltered ? <FiFilter className="text-slate-300" size={32} /> : <FiAlertOctagon className="text-slate-300" size={32} />}
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight" style={{ fontFamily: "Space Grotesk" }}>{isFiltered ? "No stations found" : "Grid Offline"}</h3>
    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed font-medium">
      {isFiltered ? "Your specific filter combination didn't yield any active stations in the grid." : "You haven't integrated any EV stations yet. Deploy hardware to start visualizing telemetry."}
    </p>
    {isFiltered && (
      <button onClick={clearFilters} className="px-6 py-3 bg-white border border-slate-200 text-teal-600 font-bold text-sm rounded-xl shadow-sm hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto">
        <FiX size={16} /> Reset active filters
      </button>
    )}
  </div>
);

const FilterBar = ({ search, setSearch, statusFilter, setStatusFilter, connectorFilter, setConnectorFilter, powerFilter, setPowerFilter, activeCount, clearFilters }) => {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 flex flex-col xl:flex-row gap-5 xl:items-center relative z-10 transition-all">
      <div className="flex-1 relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by station nomenclature or region..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none transition-all font-semibold text-sm text-slate-800 placeholder:text-slate-400 shadow-inner"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-bold text-slate-700 shadow-sm min-w-0 sm:min-w-[150px] appearance-none cursor-pointer transition-all hover:border-slate-300"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FiChevronDown size={16} />
          </div>
        </div>

        <div className="relative flex-1 sm:flex-none">
          <select
            value={connectorFilter}
            onChange={(e) => setConnectorFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-bold text-slate-700 shadow-sm min-w-0 sm:min-w-[170px] appearance-none cursor-pointer transition-all hover:border-slate-300"
          >
            <option value="All">All Hardware</option>
            {CONNECTOR_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FiChevronDown size={16} />
          </div>
        </div>

        <div className="relative flex-1 sm:flex-none">
          <select
            value={powerFilter}
            onChange={(e) => setPowerFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-bold text-slate-700 shadow-sm min-w-0 sm:min-w-[170px] appearance-none cursor-pointer transition-all hover:border-slate-300"
          >
            <option value="All">Power Output (All)</option>
            <option value="0-50">0 - 50 kW (Level 2)</option>
            <option value="50-150">50 - 150 kW (Fast)</option>
            <option value="150+">150+ kW (Ultra)</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FiChevronDown size={16} />
          </div>
        </div>

        {activeCount > 0 && (
          <button onClick={clearFilters} className="w-full sm:w-auto p-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 text-rose-600 rounded-xl transition-colors flex justify-center items-center shadow-sm" title="Clear Filters">
            <FiX size={18} /> <span className="sm:hidden font-bold ml-2">Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};


function ViewStation() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [connectorFilter, setConnectorFilter] = useState("All");
  const [powerFilter, setPowerFilter] = useState("All");

  // Modals
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });
  const [editModal, setEditModal] = useState({ isOpen: false, station: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const user = safeParse("user");

  useEffect(() => {
    fetchStations();
  }, [tab]);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const url = tab === "all" ? "/stations" : "/stations/my";
      const response = await api.get(url);
      setStations(response.data.stations);
    } catch (error) {
      toast.error("Unable to fetch stations");
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const confirmDelete = (id, name) => setDeleteModal({ isOpen: true, id, name });

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setIsDeleting(true);
      await api.delete(`/stations/${deleteModal.id}`);
      toast.success("Station deleted successfully", {
        style: { background: "#ffffff", color: "#0f172a", border: "1px solid #10b981", borderRadius: "1rem" },
        icon: "✅"
      });
      setDeleteModal({ isOpen: false, id: null, name: "" });
      fetchStations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete station", {
        style: { background: "#ffffff", color: "#0f172a", border: "1px solid #fecdd3", borderRadius: "1rem", fontWeight: "bold" }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    return stations.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.location && s.location.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      const matchConnector = connectorFilter === "All" || s.connectorType === connectorFilter;

      let matchPower = true;
      if (powerFilter !== "All") {
        const p = parseFloat(s.powerOutput) || 0;
        if (powerFilter === "0-50") matchPower = p <= 50;
        else if (powerFilter === "50-150") matchPower = p > 50 && p <= 150;
        else if (powerFilter === "150+") matchPower = p > 150;
      }

      return matchSearch && matchStatus && matchConnector && matchPower;
    });
  }, [stations, search, statusFilter, connectorFilter, powerFilter]);

  const activeFilters = (search ? 1 : 0) + (statusFilter !== "All" ? 1 : 0) + (connectorFilter !== "All" ? 1 : 0) + (powerFilter !== "All" ? 1 : 0);
  const clearFilters = () => { setSearch(""); setStatusFilter("All"); setConnectorFilter("All"); setPowerFilter("All"); };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 font-sans selection:bg-teal-500/30 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <motion.div animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
          onConfirm={executeDelete}
          stationName={deleteModal.name}
          isLoading={isDeleting}
        />
        <EditStationModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, station: null })}
          station={editModal.station}
          onSuccess={fetchStations}
        />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10 pt-2">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-white shadow-[0_8px_30px_rgb(20,184,166,0.15)] text-teal-500 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-emerald-400/10" />
              <FiActivity className="sm:w-8 sm:h-8 w-6 h-6 relative z-10 drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ fontFamily: "Space Grotesk", color: "#000", WebkitTextFillColor: "#000" }}>EV Grid Modules</h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 sm:mt-2 tracking-wide">Monitor, filter, and audit active EV infrastructure endpoints.</p>
            </div>
          </div>
          <Link to="/addstation" className="w-full sm:w-auto justify-center px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-extrabold text-sm tracking-wide rounded-xl shadow-[0_8px_20px_rgba(20,184,166,0.25)] hover:shadow-[0_8px_25px_rgba(20,184,166,0.4)] hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0">
            <FiPlus size={20} /> Add Station
          </Link>
        </div>

        <div className="flex w-full sm:w-fit gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-2xl relative z-10 backdrop-blur-md shadow-inner border border-slate-300/30">
          <button onClick={() => setTab("all")} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl transition-all font-bold text-sm relative shrink-0 z-10 ${tab === "all" ? "text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            Network Grid
            {tab === "all" && <motion.div layoutId="viewTab" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10 border border-slate-100" />}
          </button>
          <button onClick={() => setTab("my")} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl transition-all font-bold text-sm relative shrink-0 z-10 ${tab === "my" ? "text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            My Stations
            {tab === "my" && <motion.div layoutId="viewTab" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10 border border-slate-100" />}
          </button>
        </div>

        <FilterBar
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          connectorFilter={connectorFilter} setConnectorFilter={setConnectorFilter}
          powerFilter={powerFilter} setPowerFilter={setPowerFilter}
          activeCount={activeFilters} clearFilters={clearFilters}
        />

        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-left border-collapse">
              <thead className="bg-slate-50/60 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Station ID</th>
                  {tab !== "my" && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Operator Account</th>}
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Power Delivery</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden xl:table-cell">Protocol</th>
                  {tab === "my" && <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse bg-white">
                      <td className="px-8 py-6"><div className="h-5 bg-slate-200 rounded w-48 mb-2"></div><div className="h-3 bg-slate-100 rounded w-24"></div></td>
                      {tab !== "my" && <td className="px-8 py-6 hidden lg:table-cell"><div className="h-5 bg-slate-100 rounded-full w-32"></div></td>}
                      <td className="px-8 py-6"><div className="h-8 bg-slate-100 rounded-xl w-24"></div></td>
                      <td className="px-8 py-6 hidden md:table-cell"><div className="h-5 bg-slate-100 rounded w-16"></div></td>
                      <td className="px-8 py-6 hidden xl:table-cell"><div className="h-6 bg-slate-100 rounded w-20"></div></td>
                      {tab === "my" && <td className="px-8 py-6 flex justify-end"><div className="h-10 bg-slate-100 rounded-xl w-24"></div></td>}
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr className="bg-white">
                    <td colSpan={tab === "my" ? "5" : "6"} className="p-0">
                      <EmptyState isFiltered={activeFilters > 0} clearFilters={clearFilters} />
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredData.map((station, idx) => (
                      <motion.tr
                        key={station._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.04, 0.4), ease: "easeOut" }}
                        className="bg-white hover:bg-slate-50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all group scale-100 hover:scale-[1.002] z-0 hover:z-10 relative"
                      >
                        <td className="px-8 py-5">
                          <p className="font-bold text-slate-800 text-sm whitespace-normal max-w-sm leading-snug">{station.name}</p>
                          <div className="text-[11px] font-semibold text-slate-400 mt-1.5 flex items-center gap-1.5 shrink-0 transition-colors group-hover:text-slate-500">
                            <FiMapPin className="shrink-0 text-slate-300 group-hover:text-rose-400 transition-colors" size={14} /> {station.location || `${station.latitude}, ${station.longitude}`}
                          </div>
                        </td>
                        {tab !== "my" && (
                          <td className="px-8 py-5 hidden lg:table-cell">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-black flex items-center justify-center text-xs shadow-inner">
                                {station.createdBy?.name?.charAt(0) || <FiUser size={14} />}
                              </div>
                              <span className="text-sm font-bold text-slate-600">{station.createdBy?.name || "Unknown"}</span>
                            </div>
                          </td>
                        )}
                        <td className="px-8 py-5">
                          <StatusBadge status={station.status} />
                        </td>
                        <td className="px-8 py-5 hidden md:table-cell">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-800 text-sm">{station.powerOutput} <span className="text-slate-400 font-medium text-xs">kW</span></span>
                          </div>
                        </td>
                        <td className="px-8 py-5 hidden xl:table-cell">
                          <span className="bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-100 text-[11px] font-black tracking-wide shadow-sm">
                            {station.connectorType}
                          </span>
                        </td>
                        {tab === "my" && (
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditModal({ isOpen: true, station })} className="p-2.5 text-slate-400 hover:text-teal-600 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-xl transition-all shadow-sm">
                                <FiEdit size={16} />
                              </button>
                              <button onClick={() => confirmDelete(station._id, station.name)} className="p-2.5 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all shadow-sm">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-center pb-8">
          <Link to="/dashbaord" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors px-5 py-3 rounded-xl hover:bg-slate-200/50 border border-transparent hover:border-slate-300/50 shadow-[0_4px_15px_rgb(0,0,0,0.03)] bg-white/60 backdrop-blur-md">
            <FiArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewStation;