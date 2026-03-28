import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language)?.label || "English";

  return (
    <div className="flex justify-between items-center px-16 py-8 relative z-10">

      <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        NearHelp
      </h1>

      <div className="flex items-center gap-6">

        {/* Language Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/20 transition"
          >
            {currentLanguage} ▾
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition"
        >
          Login
        </button>

      </div>
    </div>
  );
}