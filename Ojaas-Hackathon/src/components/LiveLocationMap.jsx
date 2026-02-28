import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function LiveLocationMap({ position }) {
  if (!position) {
    return (
      <div className="h-[400px] flex items-center justify-center 
                      bg-[#1e293b] rounded-3xl border border-white/5 
                      shadow-2xl">
        <div className="text-center">
          <MapPin className="mx-auto mb-3 text-pink-500 animate-pulse" size={28} />
          <p className="text-gray-400 font-medium">
            Fetching live location...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl 
                    border border-white/5 
                    bg-[#1e293b] p-3">

      <div className="rounded-2xl overflow-hidden border border-white/5">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap & CartoDB'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <Marker position={position}>
            <Popup>
              <div className="text-sm text-gray-800">
                <p className="font-semibold text-black">
                  You are here 📍
                </p>
                <p>Latitude: {position[0]}</p>
                <p>Longitude: {position[1]}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="mt-4 bg-[#0f172a] border border-white/5 
                      rounded-xl px-4 py-3 text-sm text-gray-400 flex justify-between items-center">
        <span>Live GPS Tracking Enabled</span>
        <span className="text-pink-400 font-semibold">
          {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </span>
      </div>
    </div>
  );
}

