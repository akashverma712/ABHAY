import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function AdminLiveMap() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();

    const channel = supabase
      .channel("admin-live-tracking")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_locations" },
        () => {
          fetchLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLocations = async () => {
    const { data } = await supabase
      .from("user_locations")
      .select("*, profiles(username)");

    setLocations(data || []);
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        Live User Locations
      </h2>

      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-white/5">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: "420px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <div className="text-sm space-y-1 text-black">
                  <div>
                    <strong>User:</strong> {loc.profiles?.username}
                  </div>
                  <div>
                    <strong>Lat:</strong> {loc.latitude}
                  </div>
                  <div>
                    <strong>Lng:</strong> {loc.longitude}
                  </div>
                  <div>
                    <strong>Updated:</strong>{" "}
                    {new Date(loc.created_at).toLocaleString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}