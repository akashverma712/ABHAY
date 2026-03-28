export default function LocationInfoCard({ position, timestamp }) {
  if (!position) return null;

  const [lat, lng] = position;

  return (
    <div className="mt-8 bg-[#121826] border border-slate-800 rounded-2xl p-8 shadow-xl">
      
      <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        <span className="text-red-500">●</span>
        Live Location Details
      </h3>

      <div className="grid md:grid-cols-2 gap-6 text-sm">

        <div className="bg-[#0f1623] border border-slate-800 p-5 rounded-xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
            Latitude
          </p>
          <p className="font-medium text-white break-all text-base">
            {Number(lat).toFixed(6)}
          </p>
        </div>

        <div className="bg-[#0f1623] border border-slate-800 p-5 rounded-xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
            Longitude
          </p>
          <p className="font-medium text-white break-all text-base">
            {Number(lng).toFixed(6)}
          </p>
        </div>

        <div className="bg-[#0f1623] border border-slate-800 p-5 rounded-xl md:col-span-2">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
            Last Updated
          </p>
          <p className="font-medium text-white text-base">
            {timestamp?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}