import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  ShieldX,
  LogOut,
  Calendar,
  Phone,
  Briefcase,
  FileText,
  MessageCircle,
  Users,
  FilePenLine,
} from "lucide-react";

export default function ProfilePopup({ user }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    communities: 0,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  };

  const fetchStats = async () => {
    const { count: posts } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: comments } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: communities } = await supabase
      .from("community_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    setStats({
      posts: posts || 0,
      comments: comments || 0,
      communities: communities || 0,
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!profile) return null;

  const skills = profile.speciality
    ? profile.speciality.split(",")
    : [];

  return (
    <>
      <div className="absolute top-6 right-8">
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-xl hover:scale-110 transition duration-200"
        >
          {profile.username?.charAt(0)?.toUpperCase()}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#101010] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 text-center relative">
                <X
                  size={20}
                  className="absolute top-5 right-5 text-white/80 cursor-pointer hover:text-white"
                  onClick={() => setOpen(false)}
                />

                <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {profile.username?.charAt(0)?.toUpperCase()}
                </div>

                <h2 className="text-2xl font-semibold text-white mt-4">
                  {profile.username}
                </h2>

                <p className="text-white/80 text-sm mt-1">
                  {profile.role}
                </p>

                {profile.verification_status === "verified" ? (
                  <div className="flex justify-center items-center gap-1 text-green-300 text-sm mt-3">
                    <ShieldCheck size={16} />
                    Verified Professional
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-1 text-red-300 text-sm mt-3">
                    <ShieldX size={16} />
                    Not Verified
                  </div>
                )}
              </div>

              <div className="p-8 space-y-6 text-sm">

           
              

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-orange-400" />
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white ml-auto">
                    {profile.phone}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={16} className="text-orange-400" />
                    <span className="text-gray-400">Skills</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs bg-white/10 text-white rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-orange-400" />
                  <a
                    href={profile.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:underline ml-auto"
                  >
                    View Document
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-orange-400" />
                  <span className="text-gray-400">Joined:</span>
                  <span className="text-white ml-auto">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="w-full mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}