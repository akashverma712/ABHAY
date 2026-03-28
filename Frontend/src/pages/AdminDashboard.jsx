import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  X,
  User,
  ShieldCheck,
  Users,
  Search,
  MapPin,
  BadgeCheck,
  Sun,
  Moon,
} from "lucide-react";
import AdminLiveMap from "../components/AdminLiveMap";
import UserVerificationModal from "../components/UserVerificationModal";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode
    ? {
        bg: "bg-gradient-to-br from-black via-[#0b0b12] to-black text-white",
        card:
          "bg-slate-900/80 backdrop-blur-xl border-slate-800 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10",
        input:
          "bg-slate-900/80 border-slate-800 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30",
        panel: "bg-slate-900 border-slate-800 text-white",
        detail: "bg-slate-800/50 border-slate-700 text-white",
        muted: "text-white/50",
      }
    : {
        bg: "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900",
        card:
          "bg-white border-gray-200 shadow-md hover:border-purple-400 hover:shadow-xl",
        input:
          "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
        panel: "bg-white border-gray-200 text-gray-900",
        detail: "bg-gray-100 border-gray-200 text-gray-900",
        muted: "text-gray-500",
      };

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return navigate("/login");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") return navigate("/dashboard");

      fetchUsers();
    };

    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
    setFilteredUsers(data || []);
  };

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.is_verified).length;
  const pendingUsers = totalUsers - verifiedUsers;

  return (
    <div className={`min-h-screen p-8 transition-all duration-300 ${theme.bg}`}>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-xl border backdrop-blur-xl transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="mb-14">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className={`mt-3 text-lg ${theme.muted}`}>
          Monitor, verify and manage your entire ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        <StatCard icon={Users} label="Total Users" value={totalUsers} theme={theme} />
        <StatCard icon={BadgeCheck} label="Verified Users" value={verifiedUsers} theme={theme} />
        <StatCard icon={ShieldCheck} label="Pending Verification" value={pendingUsers} theme={theme} />
      </div>

      <div className="relative mb-14 max-w-lg">
        <Search className="absolute left-5 top-4 opacity-40" size={18} />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-14 pr-4 py-4 rounded-2xl border outline-none transition ${theme.input}`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredUsers.map((u, index) => (
          <div
            key={u.id}
            onClick={() => setSelectedUser(u)}
            className={`group relative rounded-3xl p-6 cursor-pointer transition-all duration-300 overflow-hidden border ${theme.card}`}
            style={{
              animation: `fadeInUp 0.4s ease forwards`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
              <User size={140} />
            </div>

            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {(u.username || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    {u.username || "Unnamed User"}
                  </h3>
                  <p className="text-xs break-all">{u.email}</p>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  u.is_verified
                    ? "text-emerald-500 border-emerald-400"
                    : "text-yellow-500 border-yellow-400"
                }`}
              >
                {u.is_verified ? "Verified" : "Pending"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <InfoMini icon={ShieldCheck} label="Role" value={u.role} theme={theme} />
              <InfoMini
                icon={BadgeCheck}
                label="Verified"
                value={u.is_verified ? "Yes" : "No"}
                theme={theme}
              />
            </div>

            <button
              onClick={() => setSelectedUser(u)}
              className="mt-6 w-full py-3 rounded-xl font-medium transition bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 text-purple-400"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50">
          <div className={`w-full sm:w-[450px] h-full p-8 overflow-y-auto border-l ${theme.panel}`}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">User Profile</h2>
              <button onClick={() => setSelectedUser(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <Detail label="User ID" value={selectedUser.id} theme={theme} />
              <Detail label="Username" value={selectedUser.username} theme={theme} />
              <Detail label="Email" value={selectedUser.email} theme={theme} />
              <Detail label="Role" value={selectedUser.role} theme={theme} />
              <Detail
                label="Verified"
                value={selectedUser.is_verified ? "Yes" : "No"}
                theme={theme}
              />
            </div>

            {!selectedUser.is_verified && (
              <button
                onClick={() => setShowVerifyModal(true)}
                className="mt-10 w-full py-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-500 hover:from-green-500/30 hover:to-emerald-500/30 transition"
              >
                Verify This User
              </button>
            )}
          </div>
        </div>
      )}

      {showVerifyModal && selectedUser && (
        <UserVerificationModal
          user={selectedUser}
          onClose={() => setShowVerifyModal(false)}
          onVerified={fetchUsers}
        />
      )}

      {/* LIVE MAP */}
      <div className="mt-28">
        <div className="flex items-center gap-3 mb-6">
          <MapPin />
          <h2 className="text-2xl font-bold">
            Live Location Tracking
          </h2>
        </div>

        <div className={`rounded-3xl overflow-hidden border transition ${theme.card}`}>
          <AdminLiveMap />
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({ icon: Icon, label, value, theme }) {
  return (
    <div className={`rounded-3xl p-8 flex items-center gap-6 border transition-all duration-300 ${theme.card}`}>
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
        <Icon size={30} />
      </div>
      <div>
        <p className="text-4xl font-bold">{value}</p>
        <p className={`text-sm mt-1 ${theme.muted}`}>{label}</p>
      </div>
    </div>
  );
}

function InfoMini({ icon: Icon, label, value, theme }) {
  return (
    <div className={`rounded-xl p-4 border text-center ${theme.detail}`}>
      <Icon className="h-5 w-5 mx-auto mb-2 text-purple-500" />
      <p className="text-lg font-bold capitalize">{value}</p>
      <p className="text-xs opacity-60">{label}</p>
    </div>
  );
}

function Detail({ label, value, theme }) {
  return (
    <div className={`p-5 rounded-2xl border ${theme.detail}`}>
      <span className="opacity-60 text-xs block mb-1">{label}</span>
      <span className="font-medium break-all">{value}</span>
    </div>
  );
}