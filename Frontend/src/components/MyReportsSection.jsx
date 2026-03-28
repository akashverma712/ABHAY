import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function MyReportsSection({ user }) {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (!user) return;

    fetchReports();

    const channel = supabase
      .channel("report-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "medical_reports",
          filter: `user_id=eq.${user.id}`,
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setReports(data || []);
  };

  const markResolved = async () => {
    await supabase
      .from("medical_reports")
      .update({
        resolved_by_reporter: true,
        status: "resolved",
      })
      .eq("id", selectedReportId);

    setSelectedReportId(null);
    setRating(5);
    setReview("");
  };

  const openReviewModal = (id) => {
    setSelectedReportId(id);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "resolved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 tracking-wide">
        My Reported Issues
      </h2>

      {reports.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          No reports yet.
        </p>
      )}

      <div className="space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold tracking-wide">
                {report.title}
              </h3>
              <span
                className={`px-3 py-1 text-xs rounded-full border ${getStatusStyle(
                  report.status
                )}`}
              >
                {report.status.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">
              {report.description}
            </p>

            {report.status === "accepted" &&
              report.helper_latitude &&
              report.helper_longitude && (
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg mb-3">
                  <p className="text-green-400 text-sm">
                    🚑 Helper is{" "}
                    <span className="font-semibold">
                      {getDistance(
                        report.latitude,
                        report.longitude,
                        report.helper_latitude,
                        report.helper_longitude
                      ).toFixed(2)}{" "}
                      km away
                    </span>
                  </p>
                </div>
              )}

            {report.status === "resolved" && (
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mb-3">
                <p className="text-blue-400 text-sm">
                  ✅ Issue marked as resolved
                </p>
              </div>
            )}

            {report.status !== "resolved" && (
              <button
                onClick={() => openReviewModal(report.id)}
                className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-5 py-2 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedReportId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl w-[420px] shadow-2xl animate-scaleIn">
            <h3 className="text-xl font-semibold mb-6 tracking-wide">
              Rate & Review Helper
            </h3>

            <div className="mb-5">
              <label className="block text-sm mb-2 text-gray-400">
                Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-400">
                Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedReportId(null)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={markResolved}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition shadow-md hover:shadow-lg"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}