import { useState } from "react";
import { supabase } from "../lib/supabase";
import { MapPin, UploadCloud } from "lucide-react";

export default function ReportIssueSection({ user, position }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reportedFor, setReportedFor] = useState("self");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!position) return alert("Location not available");

    if (!title.trim() || !description.trim()) {
      return alert("Please fill all required fields");
    }

    setLoading(true);

    try {
      let imageUrl = null;

      if (image) {
        const filePath = `${user.id}/${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("medical-reports")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("medical-reports")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from("medical_reports").insert({
        user_id: user.id,
        title,
        description,
        reported_for: reportedFor,
        latitude: position.latitude,
        longitude: position.longitude,
        image_url: imageUrl,
        status: "open",
        helper_status: "none",
      });

      if (error) throw error;

      alert("✅ Issue submitted successfully!");

      setTitle("");
      setDescription("");
      setReportedFor("self");
      setImage(null);
      setPreview(null);
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-3xl 
                    bg-white/5 backdrop-blur-xl 
                    border border-white/10 text-white shadow-2xl">

      <h2 className="text-3xl font-bold mb-2 
                     bg-gradient-to-r from-purple-400 to-blue-500 
                     bg-clip-text text-transparent">
        Raise Medical Issue
      </h2>
      <p className="text-white/50 mb-8">
        Share the problem and your location will be attached automatically.
      </p>

      {position && (
        <div className="mb-6 p-4 rounded-2xl 
                        bg-blue-500/10 border border-blue-500/30 
                        flex items-start gap-3">
          <MapPin className="text-blue-400 mt-1" size={18} />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">
              This coordinate is being shared:
            </p>
            <p className="text-white/70 font-mono">
              Latitude: {position.latitude} <br />
              Longitude: {position.longitude}
            </p>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Which skill do you need for this?"
        className="w-full p-4 rounded-2xl mb-5 
                   bg-white/5 border border-white/10
                   focus:border-purple-500 outline-none transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Describe the situation clearly..."
        className="w-full p-4 rounded-2xl mb-5 
                   bg-white/5 border border-white/10
                   focus:border-purple-500 outline-none transition"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full p-4 rounded-2xl mb-6 
                   bg-white/5 border border-white/10
                   focus:border-purple-500 outline-none transition"
        value={reportedFor}
        onChange={(e) => setReportedFor(e.target.value)}
      >
        <option value="self">Problem with Me</option>
        <option value="someone_else">Problem with Someone Else</option>
      </select>

      <label className="flex flex-col items-center justify-center 
                        p-6 mb-6 rounded-2xl cursor-pointer
                        border-2 border-dashed border-purple-500/40
                        bg-purple-500/5 hover:bg-purple-500/10 transition">
        <UploadCloud className="text-purple-400 mb-2" size={28} />
        <span className="text-sm text-purple-300">
          Click to upload image
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
          className="hidden"
        />
      </label>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mb-6 rounded-2xl max-h-56 object-cover border border-white/10"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-semibold transition-all
          ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02]"
          }`}
      >
        {loading ? "Submitting..." : "Submit Issue"}
      </button>
    </div>
  );
}