import { useState } from "react";
import { supabase } from "../lib/supabase";
import { CheckCircle, XCircle } from "lucide-react";

export default function UserVerificationModal({
  user,
  onClose,
  onVerified,
}) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", user.id);

    setLoading(false);

    if (!error) {
      onVerified();
      onClose();
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-[#111117] border border-white/10 rounded-3xl p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Verify User
        </h2>

        <div className="space-y-3 text-sm mb-8">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(user.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            {loading ? "Verifying..." : "Confirm & Verify"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center justify-center gap-2"
          >
            <XCircle size={18} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}