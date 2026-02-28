import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { User, Shield, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSwitching(true);
    const timer = setTimeout(() => setIsSwitching(false), 800);
    return () => clearTimeout(timer);
  }, [isAdminLogin, isSignup]);



  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/dashboard",
      },
    });
  };

  const handleAuth = async () => {
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, phone },
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleAdminLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Invalid admin credentials");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      await supabase.auth.signOut();
      alert("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    navigate("/admin-dashboard");
    setLoading(false);
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <div className="relative w-full h-screen rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl">

        <div
          className={`absolute inset-0 w-full lg:w-1/2 h-full flex items-center justify-center px-12 transition-all duration-[1000ms]
          ${isAdminLogin
              ? "translate-x-full bg-gradient-to-tr from-orange-600/20 to-pink-600/30"
              : "translate-x-0 bg-gradient-to-r from-cyan-600/10 to-purple-600/20"
            }`}
        >
          <div className="text-white max-w-lg">
            <div className="flex items-center gap-6 mb-10">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                {isAdminLogin ? <Shield size={60} /> : <User size={60} />}
              </div>
              <div>
                <h1 className="text-4xl font-extrabold">
                  {isAdminLogin ? "Admin Portal" : "User Portal"}
                </h1>
                <p className="text-xl opacity-80 mt-2">
                  {isAdminLogin
                    ? "Secure Administrative Access"
                    : "Access Your Dashboard"}
                </p>
              </div>
            </div>

            <ul className="space-y-6 text-lg">
              <li className="flex gap-4 items-center">
                <Sparkles />
                Secure Authentication
              </li>
              <li className="flex gap-4 items-center">
                <Sparkles />
                Real-time Data Access
              </li>
              <li className="flex gap-4 items-center">
                <Sparkles />
                Modern AI Powered System
              </li>
            </ul>
          </div>
        </div>

        <div
          className="absolute top-0 h-full w-full lg:w-1/2 bg-slate-900/80 backdrop-blur-2xl flex items-center justify-center px-8 z-10 transition-all duration-[1000ms]"
          style={{ left: isAdminLogin ? 0 : "50%" }}
        >
          <div
            className="w-full max-w-md transition-all duration-500"
            style={{
              opacity: isSwitching ? 0 : 1,
              transform: isSwitching
                ? isAdminLogin
                  ? "translateX(-50px)"
                  : "translateX(50px)"
                : "translateX(0)",
            }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white">
                {isAdminLogin
                  ? "Admin Login"
                  : isSignup
                  ? "Create Account"
                  : "Login"}
              </h2>
              <p className="text-gray-400 mt-2">
                {isAdminLogin
                  ? "Admins only"
                  : isSignup
                  ? "Create your account"
                  : "Welcome back"}
              </p>
            </div>

            {!isAdminLogin && (
              <>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full mb-4 py-4 rounded-2xl font-semibold text-black bg-white hover:scale-105 transition-all"
                >
                  Continue with Google
                </button>

                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="px-3 text-sm text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>
              </>
            )}

            {isSignup && !isAdminLogin && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={isAdminLogin ? handleAdminLogin : handleAuth}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-pink-600 hover:scale-105 transition-all disabled:opacity-60"
            >
              {loading
                ? "Processing..."
                : isAdminLogin
                ? "Login as Admin"
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>

            {!isAdminLogin && (
              <p className="text-center text-gray-400 mt-6">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-orange-500 font-semibold"
                >
                  {isSignup ? "Login" : "Create account"}
                </button>
              </p>
            )}

            <p className="text-center text-gray-500 mt-6">
              <button
                onClick={() => {
                  setIsAdminLogin(!isAdminLogin);
                  setIsSignup(false);
                }}
              >
                {isAdminLogin
                  ? "Back to user login"
                  : "Login as Admin"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}