import { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full transition duration-300
      ${darkMode 
        ? "bg-white/10 hover:bg-white/20 text-yellow-400" 
        : "bg-black/10 hover:bg-black/20 text-blue-600"}`}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}