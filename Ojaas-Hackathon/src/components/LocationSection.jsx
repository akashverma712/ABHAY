import LiveLocationMap from "./LiveLocationMap";
import LocationInfoCard from "./LocationInfoCard";

export default function LocationSection({ position, timestamp }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">
        My Live Location
      </h2>

      <LiveLocationMap position={position} />
      <LocationInfoCard position={position} timestamp={timestamp} />
    </div>
  );
}