import { useState } from "react";
import {
  Home,
  MapPin,
  ShieldCheck,
  Siren,
  LogOut,
  FilePlus,
  ClipboardList,
  FileSearch,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, logout }) {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ SOS moved to top
  const menuItems = [
    { id: "sos", label: "SOS", icon: Siren },
    { id: "location", label: "Location", icon: MapPin },
    { id: "community", label: "Community", icon: Home },
    { id: "skills", label: "Skills", icon: ShieldCheck },
    { id: "report", label: "Report Issue", icon: FilePlus },
    { id: "myReports", label: "My Reports", icon: ClipboardList },
    { id: "reports", label: "Reports", icon: FileSearch },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ];

  return (
    <>
      {/* 🔥 Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          NearHelp
        </h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 🔥 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔥 Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 z-50
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          bg-white/5 backdrop-blur-xl
          border-r border-white/10
          p-6 flex flex-col justify-between
        `}
      >
        <div>
          <h1 className="hidden md:block text-2xl font-bold mb-10
                         bg-gradient-to-r from-purple-400 to-blue-500 
                         bg-clip-text text-transparent">
            NearHelp
          </h1>

          <div className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl
                    transition-all duration-300
                    ${
                      isActive
                        ? item.id === "sos"
                          ? "bg-red-600 text-white shadow-lg animate-pulse"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        : item.id === "sos"
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "hover:bg-white/10 text-white/80 hover:text-white"
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🔥 Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-3 mt-6
                     rounded-xl
                     bg-red-500/80 hover:bg-red-600
                     transition-all duration-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );
}