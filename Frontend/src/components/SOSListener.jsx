import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

export default function SOSListener({ user, position }) {
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchLatestSOS = async () => {
      const { data, error } = await supabase
        .from("sos_alerts")
        .select("*")
        .neq("user_id", user.id) 
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Polling Error:", error);
        return;
      }

      if (data && data.length > 0) {
        const latest = data[0];

        if (!alertData || alertData.id !== latest.id) {
          setAlertData(latest);

          setTimeout(() => {
            setAlertData(null);
          }, 30000);
        }
      }
    };

    const interval = setInterval(fetchLatestSOS, 5000);

    return () => clearInterval(interval);
  }, [user, alertData]);

  if (
    !alertData ||
    !position?.coords ||
    alertData.latitude == null ||
    alertData.longitude == null
  ) {
    return null;
  }

  const distance = calculateDistance(
    position.coords.latitude,
    position.coords.longitude,
    alertData.latitude,
    alertData.longitude
  );

  return (
    <div className="fixed bottom-6 right-6 bg-red-600 p-6 rounded-2xl shadow-xl w-96 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xl">🚨 Emergency Alert</h3>
        <button
          onClick={() => setAlertData(null)}
          className="text-white text-lg"
        >
          ✖
        </button>
      </div>

      <p className="text-sm mb-2">{alertData.message}</p>
      <p className="text-sm">📍 {alertData.location_name}</p>
      <p className="text-sm mt-1">📏 {distance} km away</p>

      <a
        href={`https://www.google.com/maps?q=${alertData.latitude},${alertData.longitude}`}
        target="_blank"
        rel="noreferrer"
        className="block mt-4 bg-white text-red-600 text-center py-2 rounded-xl font-semibold"
      >
        Open in Maps
      </a>
    </div>
  );
}