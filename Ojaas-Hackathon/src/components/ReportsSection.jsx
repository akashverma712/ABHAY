import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { MapPin, CheckCircle, X } from "lucide-react";

export default function ReportsSection({ user }) {
  const [reports, setReports] = useState([]);
  const [activeHelpingId, setActiveHelpingId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ NEW

  const fixedLatitude = 22.776632;
  const fixedLongitude = 86.147534;

  useEffect(() => {
    if (!user) return;

    fetchReports();

    const channel = supabase
      .channel("reports-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medical_reports",
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchReports = async () => {
    const { data } = await supabase
      .from("medical_reports")
      .select("*")
      .neq("user_id", user.id)
      .in("status", ["open", "accepted"])
      .order("created_at", { ascending: false });

    setReports(data || []);
  };

  const acceptReport = async (report) => {
    await supabase
      .from("medical_reports")
      .update({
        helper_id: user.id,
        helper_status: "accepted",
        status: "accepted",
        helper_latitude: fixedLatitude,
        helper_longitude: fixedLongitude,
        helper_last_updated: new Date(),
      })
      .eq("id", report.id);

    await supabase.from("notifications").insert({
      user_id: report.user_id,
      report_id: report.id,
      message: "🚑 Someone is reaching your location!",
    });

    setActiveHelpingId(report.id);
    setSelectedReport(null);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const completeReport = async (id) => {
    await supabase
      .from("medical_reports")
      .update({
        helper_status: "completed",
        status: "resolved",
      })
      .eq("id", id);

    setActiveHelpingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 text-white">
      <h2 className="text-3xl font-bold mb-8 
                     bg-gradient-to-r from-purple-400 to-blue-500 
                     bg-clip-text text-transparent">
        Active Reports
      </h2>

      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 
                        bg-green-600/20 border border-green-500/40
                        backdrop-blur-lg px-6 py-4 rounded-2xl
                        flex items-center gap-3 shadow-xl animate-pulse">
          <CheckCircle className="text-green-400" />
          <span className="text-green-300 font-medium">
            You are now heading to help. Stay safe!
          </span>
        </div>
      )}

      {reports.length === 0 && (
        <p className="text-gray-400">No active reports available.</p>
      )}

      <div className="grid gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl
                       border border-white/10 shadow-xl hover:scale-[1.02]
                       transition duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold">{report.title}</h3>

              <span
                className={`px-3 py-1 text-xs rounded-full border ${
                  report.status === "open"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-green-500/20 text-green-400 border-green-500/30"
                }`}
              >
                {report.status}
              </span>
            </div>

            <p className="text-white/70 mb-4">{report.description}</p>

            <div className="flex items-center gap-2 text-blue-400 text-sm mb-4">
              <MapPin size={16} />
              Location: {report.latitude}, {report.longitude}
            </div>

            {report.status === "open" && (
              <button
                onClick={() => setSelectedReport(report)}
                className="px-5 py-2 rounded-xl 
                           bg-gradient-to-r from-green-600/40 to-emerald-600/40
                           hover:from-green-600/60 hover:to-emerald-600/60
                           transition"
              >
                I'm Reaching
              </button>
            )}

            {report.helper_id === user.id &&
              report.status === "accepted" && (
                <button
                  onClick={() => completeReport(report.id)}
                  className="ml-3 px-5 py-2 rounded-xl 
                             bg-gradient-to-r from-blue-600/40 to-purple-600/40
                             hover:from-blue-600/60 hover:to-purple-600/60
                             transition"
                >
                  Mark as Completed
                </button>
              )}
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm 
                        flex justify-center items-center z-50">
          <div className="bg-[#111118] p-8 rounded-3xl 
                          w-full max-w-md border border-white/10">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                Confirm You're Reaching
              </h3>
              <button onClick={() => setSelectedReport(null)}>
                <X />
              </button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 
                            rounded-2xl p-4 mb-6 text-sm">
              <p className="text-blue-300 font-medium">
                Your Current Shared Location:
              </p>
              <p className="font-mono text-white/80 mt-1">
                Latitude: {fixedLatitude}
                <br />
                Longitude: {fixedLongitude}
              </p>
            </div>

            <button
              onClick={() => acceptReport(selectedReport)}
              className="w-full py-3 rounded-xl 
                         bg-gradient-to-r from-green-600 to-emerald-600 
                         hover:scale-[1.02] transition"
            >
              Confirm & Start Helping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}