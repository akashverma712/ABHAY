import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Upload, Star, CheckCircle, ArrowRight } from "lucide-react";

const predefinedSkills = [
  "CPR Certified",
  "First Aid Trained",
  "Nurse",
  "Doctor",
  "Paramedic",
  "Emergency Medical Technician",
  "Medical Student",
  "Disaster Response Volunteer",
];

export default function SkillVerificationForm({ user }) {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("speciality, experience_years, verification_status")
      .eq("id", user.id)
      .single();

    if (data) {
      setSelectedSkill(data.speciality || "");
      setExperience(data.experience_years || "");
      setStatus(data.verification_status);
    }
  };

  const handleSubmit = async () => {
    const finalSkill =
      selectedSkill === "Other" ? customSkill : selectedSkill;

    if (!finalSkill || !experience) {
      alert("Please complete all required fields");
      return;
    }

    setLoading(true);
    let documentUrl = null;

    if (file) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("verification-documents")
        .upload(filePath, file);

      if (error) {
        alert("File upload failed");
        setLoading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(filePath);

      documentUrl = publicUrl.publicUrl;
    }

    await supabase.from("profiles").update({
      speciality: finalSkill,
      experience_years: experience,
      document_url: documentUrl,
      verification_status: "pending",
    }).eq("id", user.id);

    setStatus("pending");
    setLoading(false);
  };

  const statusStyles = {
    verified: "bg-green-500/10 text-green-400 border-green-500/30",
    rejected: "bg-red-500/10 text-red-400 border-red-500/30",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 flex items-center justify-center">

      <div className="max-w-4xl w-full bg-[#1e293b] rounded-3xl p-10 shadow-2xl border border-white/5">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Skill Verification
          </h1>
          <p className="text-gray-400 mt-3">
            Submit your medical or emergency expertise for review.
          </p>
        </div>

        {status && (
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border mb-8 ${statusStyles[status]}`}>
            {status.toUpperCase()}
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Star className="text-pink-500" />
            Select Your Primary Skill
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {predefinedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 rounded-2xl border text-sm font-semibold transition-all duration-300
                ${
                  selectedSkill === skill
                    ? "bg-gradient-to-r from-pink-600/20 to-orange-600/20 border-pink-500 text-pink-400 shadow-lg"
                    : "bg-[#0f172a] border-white/5 text-gray-300 hover:border-orange-500/40 hover:shadow-orange-500/10"
                }`}
              >
                {skill}
              </button>
            ))}

            <button
              onClick={() => setSelectedSkill("Other")}
              className={`p-4 rounded-2xl border text-sm font-semibold transition-all duration-300
              ${
                selectedSkill === "Other"
                  ? "bg-gradient-to-r from-pink-600/20 to-orange-600/20 border-pink-500 text-pink-400 shadow-lg"
                  : "bg-[#0f172a] border-white/5 text-gray-300 hover:border-orange-500/40 hover:shadow-orange-500/10"
              }`}
            >
              Other
            </button>
          </div>
        </div>

        {selectedSkill === "Other" && (
          <input
            type="text"
            placeholder="Enter your custom skill"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            className="w-full mb-8 bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
          />
        )}

]        <div className="mb-10">
          <label className="block text-gray-400 mb-3 font-medium">
            Years of Experience
          </label>
          <input
            type="number"
            placeholder="Enter years"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <div className="mb-12">
          <label className="block text-gray-400 mb-3 font-medium">
            Upload Certification (Optional)
          </label>

          <div className="group border border-dashed border-white/10 rounded-2xl p-8 text-center bg-[#0f172a] hover:border-pink-500/40 transition-all duration-300">
            <Upload className="mx-auto mb-3 text-gray-400 group-hover:text-pink-400 transition" size={28} />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-300"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`group w-full py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3
          ${
            loading
              ? "bg-orange-500/40 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-600 to-orange-500 hover:scale-105 hover:shadow-pink-500/25"
          }`}
        >
          {loading ? "Submitting..." : "Submit for Verification"}
          {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
        </button>

      </div>
    </div>
  );
}