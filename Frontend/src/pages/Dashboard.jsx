import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";
import {
  FiZap, FiMap, FiList, FiActivity, FiBatteryCharging, FiAlertCircle,
  FiClock, FiMenu, FiX, FiLogOut, FiSettings, FiChevronDown,
  FiWifi, FiMapPin, FiPieChart, FiHome, FiSearch, FiRadio, FiRefreshCw
} from "react-icons/fi";
import api from "../api/api";

// ============================================
// 1. Constants & Configuration
// ============================================

const FALLBACK_STATIONS = [
  { _id: "s1", name: "Baner Riverside Hub", status: "Active", powerOutput: 150, connectorType: "CCS", location: "Baner, Pune", usage: 87 },
  { _id: "s2", name: "Hinjewadi Tech Park", status: "Active", powerOutput: 120, connectorType: "Type 2", location: "Hinjewadi, Pune", usage: 92 },
  { _id: "s3", name: "Koregaon Mall Plaza", status: "Active", powerOutput: 60, connectorType: "Type 2", location: "Koregaon Park, Pune", usage: 45 },
];

const CONNECTOR_COLORS = {
  CCS: "#14B8A6",      // Teal-500
  "Type 2": "#0EA5E9", // Sky-500
  CHAdeMO: "#F59E0B",  // Amber-500
  Tesla: "#F43F5E",    // Rose-500
  GB: "#10B981",       // Emerald-500
};

const STATUS_STYLES = {
  Active: { dot: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-100", ring: "ring-teal-500/30" },
  Inactive: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-100", ring: "ring-rose-500/30" },
  Maintenance: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-100", ring: "ring-amber-500/30" },
};

const NAV_ITEMS = [
  { icon: FiHome, label: "Dashboard", link: "/dashboard" },
  { icon: FiList, label: "Stations", link: "/viewstations" },
  { icon: FiMap, label: "Map View", link: "/map" },
  { icon: FiPieChart, label: "Analytics", link: "/analytics" },
  { icon: FiSettings, label: "Settings", link: "/settings" },
];

const generatePowerTrend = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2;
    const time = `${String(hour).padStart(2, "0")}:00`;
    const base = 200 + Math.random() * 600;
    return { time, kW: Math.round(base) };
  });
};

// ============================================
// 2. Authentication Context (File Scoped)
// ============================================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ============================================
// 3. UI Components
// ============================================

const SkeletonLoader = ({ className }) => (
  <div className={`relative overflow-hidden bg-slate-200 rounded-xl ${className}`}>
    <motion.div
      className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-black/5 to-transparent"
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />
  </div>
);

const DashboardSkeletons = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div>
        <SkeletonLoader className="h-8 w-48 mb-2" />
        <SkeletonLoader className="h-4 w-72" />
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200">
          <SkeletonLoader className="h-4 w-24 mb-4" />
          <SkeletonLoader className="h-8 w-20" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 h-80" />
      <div className="bg-white rounded-2xl p-6 border border-slate-200 h-80" />
    </div>
  </div>
);

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeCount }) => {
  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-50 border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-600 group-hover:scale-105 transition-transform">
              <FiZap size={18} />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight" style={{ fontFamily: "Space Grotesk" }}>VoltGrid</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label} to={item.link} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${item.label === "Dashboard" ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-6 mt-auto">
          <div className="rounded-2xl bg-white border border-slate-200 p-4 text-left">
            <div className="flex items-center gap-2 text-teal-600 text-[11px] font-bold uppercase tracking-wider mb-2">
              <FiRadio size={12} className="animate-pulse" /> Grid Status
            </div>
            <p className="text-slate-900 font-bold text-lg" style={{ fontFamily: "JetBrains Mono" }}>Operational</p>
            <p className="text-slate-500 text-xs mt-1">{activeCount} active stations</p>
          </div>
        </div>
      </aside>
    </>
  );
};

const Topbar = ({ setSidebarOpen, onSync, searchTerm, setSearchTerm, now }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => userMenuRef.current && !userMenuRef.current.contains(e.target) && setUserMenuOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-[1600px] mx-auto gap-3">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 p-2 -ml-2 hover:bg-slate-100 rounded-lg"><FiMenu size={22} /></button>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-slate-500 font-mono tracking-wider flex items-center gap-1.5"><FiClock size={12} className="text-teal-600" />{now.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 sm:px-4 focus-within:border-teal-500/50 transition-colors w-full max-w-[180px] sm:max-w-[240px]">
            <FiSearch size={14} className="text-slate-500 shrink-0" />
            <input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent text-sm text-slate-800 outline-none w-full min-w-0" />
          </div>
          <button onClick={onSync} className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-full transition-colors shrink-0"><FiRefreshCw size={18} /></button>
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200">
              <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">{user?.name?.charAt(0) || "A"}</div>
              <FiChevronDown size={14} className="text-slate-500" />
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-bold text-slate-800">{user?.name || "Admin"}</p>
                    <p className="text-xs text-slate-500">{user?.email || "admin@voltgrid.com"}</p>
                  </div>
                  <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 w-full text-left transition-colors"><FiLogOut size={15} /> Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

const StatCard = ({ title, value, icon: Icon, accent, index }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl p-5 border border-slate-200 relative overflow-hidden group">
    <div className="flex items-center justify-between relative z-10">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50" style={{ color: accent }}><Icon size={18} /></div>
    </div>
    <p className="text-3xl font-bold mt-4 text-slate-900 relative z-10" style={{ fontFamily: "Space Grotesk" }}>{value}</p>
  </motion.div>
);

const PowerTrendChart = ({ data, loading }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 lg:col-span-2">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-black" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>Power Draw (24h)</h2>
      <div className="flex items-center gap-2 px-2 py-1 bg-teal-50 rounded-md border border-teal-200"><FiActivity className="text-teal-600" size={12} /><span className="text-[10px] font-bold tracking-wider text-teal-600 uppercase">Live</span></div>
    </div>
    {loading || !data?.length ? (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400"><FiActivity size={32} className="opacity-20 mb-2" /><p>No data</p></div>
    ) : (
      <div className="h-64 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", color: "#0f172a" }} itemStyle={{ color: "#0f172a" }} />
            <Area type="monotone" dataKey="kW" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorKw)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

const ConnectorPieChart = ({ data, loading }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-black" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>Connector Mix</h2>
      <FiPieChart className="text-amber-500" size={18} />
    </div>
    {loading || !data?.length ? (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400"><FiPieChart size={32} className="opacity-20 mb-2" /><p>No data</p></div>
    ) : (
      <>
        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {data.map((e) => <Cell key={e.name} fill={CONNECTOR_COLORS[e.name] || "#94a3b8"} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", color: "#0f172a" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
          {data.map((c) => (
            <div key={c.name} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CONNECTOR_COLORS[c.name] || "#94a3b8" }} />
              <span className="text-slate-600">{c.name}</span>
              <span className="text-slate-900 font-bold ml-auto">{c.value}</span>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

const StationsTable = ({ stations, searchTerm }) => (
  <div className="bg-white rounded-2xl border border-slate-200 lg:col-span-2 overflow-hidden">
    <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-black" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>Network Stations</h2>
        <p className="text-xs text-slate-500 mt-1">{stations.length} stations found</p>
      </div>
      <Link to="/viewstations" className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-full border border-teal-200 transition-colors self-start">View All Summary →</Link>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Station Info</th>
            <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
            <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Power</th>
            <th className="text-left py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stations.length ? stations.slice(0, 3).map((s) => {
            const st = STATUS_STYLES[s.status] || STATUS_STYLES.Inactive;
            return (
              <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><FiMapPin size={10} /> {s.latitude}, {s.longitude}</p>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${st.bg} ${st.text} ${st.ring}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{s.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm font-bold text-slate-700" style={{ fontFamily: "JetBrains Mono" }}>{s.powerOutput} kW</td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <span className="text-sm text-slate-700 flex items-center gap-1.5"><FiMapPin className="text-slate-400" size={14} />{s.location}</span>
                </td>
              </tr>
            )
          }) : (
            <tr><td colSpan={4} className="py-12 text-center text-slate-500">No stations {searchTerm && "match your search"}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const ActivityFeed = ({ stations }) => {
  const activeCount = stations.filter(s => s.status === "Active").length;
  const activities = [
    { text: `${activeCount} stations online`, type: 'zap', time: 'Just now' },
    { text: `Network load healthy`, type: 'activity', time: '2m ago' },
    { text: `${stations.length} total nodes`, type: 'nodes', time: '1h ago' }
  ];
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-black" style={{ fontFamily: "Space Grotesk", color: "#000000" }}>Recent Activity</h2>
        <FiWifi className="text-slate-500" />
      </div>
      <div className="space-y-6">
        {activities.map((a, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500">
                {a.type === 'zap' ? <FiZap size={14} className="text-amber-500" /> : <FiActivity size={14} className="text-teal-500" />}
              </div>
              {i < 2 && <div className="w-px h-full bg-slate-200 mt-2" />}
            </div>
            <div className="pb-2">
              <p className="text-sm font-medium text-slate-700">{a.text}</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 4. Main Page Dashboard Layout
// ============================================
function DashboardContent() {
  const { user } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [powerTrend, setPowerTrend] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = useMemo(() => {
    const active = stations.filter(s => s.status === "Active").length;
    const inactive = stations.length - active;
    const totalPower = stations.reduce((sum, s) => sum + (s.powerOutput || 0), 0);
    const avgPower = stations.length > 0 ? Math.round(totalPower / stations.length) : 0;
    const ownNodes = user ? stations.filter(s => s.createdBy === user._id || s.createdBy === user.id).length : 0;
    return { total: stations.length, active, inactive, totalPower, avgPower, ownNodes };
  }, [stations, user]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    setPowerTrend(generatePowerTrend());
    fetchStations();
    return () => clearInterval(tick);
  }, []);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/stations");
      if (response.data?.success && response.data?.stations) {
        setStations(response.data.stations.map((s) => ({
          ...s,
          usage: Math.floor(Math.random() * 100),
          location: s.location || `${s.latitude || 18.5}, ${s.longitude || 73.8}`,
        })));
      } else {
        setStations(FALLBACK_STATIONS);
      }
    } catch {
      toast.error("Failed to fetch stations", { style: { background: "#1E293B", color: "#fff" } });
      setStations(FALLBACK_STATIONS);
    } finally {
      setTimeout(() => setLoading(false), 500); // For demo skeleton shimmer
    }
  };

  const filteredStations = useMemo(() => stations.filter(s => !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase())), [stations, searchTerm]);
  const connectorBreakdown = useMemo(() => Object.entries(stations.reduce((acc, s) => { if (s.connectorType) acc[s.connectorType] = (acc[s.connectorType] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value })), [stations]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500/30">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeCount={stats.active} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar setSidebarOpen={setSidebarOpen} onSync={fetchStations} now={now} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-8">
          {loading ? <DashboardSkeletons /> : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-teal-600 font-bold mb-1 text-sm tracking-wide uppercase">
                    {now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening"}, {user?.name?.split(' ')[0] || "Admin"} 👋
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-black" style={{ fontFamily: 'Space Grotesk', color: '#000000' }}>Network Overview</h1>
                  <p className="text-sm text-slate-500 mt-1">Monitor charging infrastructure and live station health centrally.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <Link to="/map" className="sm:hidden justify-center px-4 py-2.5 bg-slate-800 text-white font-bold text-sm rounded-lg hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2">
                    <FiMap size={16} /> Map View
                  </Link>
                  <Link to="/viewstations" className="text-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                    Manage Stations
                  </Link>
                  <Link to="/addstation" className="justify-center px-4 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2">
                    <FiZap size={16} /> Add Station
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard title="Total Nodes" value={stats.total} icon={FiZap} accent="#14B8A6" index={0} />
                <StatCard title="Active Network" value={stats.active} icon={FiActivity} accent="#10B981" index={1} />
                <StatCard title="Total Load" value={`${stats.totalPower} kW`} icon={FiBatteryCharging} accent="#F59E0B" index={2} />
                <StatCard title="Own Node" value={stats.ownNodes} icon={FiRadio} accent="#4F46E5" index={3} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PowerTrendChart data={powerTrend} loading={loading} />
                <ConnectorPieChart data={connectorBreakdown} loading={loading} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                <StationsTable stations={filteredStations} searchTerm={searchTerm} />
                <ActivityFeed stations={stations} />
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

// Wrapping default export in AuthProvider internally
export default function Dashboard() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}