import { useTranslation } from "react-i18next";

export default function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      value: t("stats.sosRadius.value"),
      label: t("stats.sosRadius.label"),
      gradient: "from-purple-400 to-blue-500",
    },
    {
      value: t("stats.liveMap.value"),
      label: t("stats.liveMap.label"),
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      value: t("stats.aiResponse.value"),
      label: t("stats.aiResponse.label"),
      gradient: "from-green-400 to-emerald-400",
    },
  ];

  return (
    <div className="mt-20 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white/5 border border-white/10 
                       backdrop-blur-2xl rounded-3xl p-8 text-center
                       transition-all duration-300 
                       hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Glow Effect */}
            <div
              className="absolute inset-0 rounded-3xl opacity-0 
                         group-hover:opacity-100 transition duration-500
                         bg-gradient-to-br from-white/10 to-transparent blur-xl"
            ></div>

            {/* Value */}
            <p
              className={`text-4xl sm:text-5xl font-bold mb-3
                          bg-gradient-to-r ${stat.gradient}
                          bg-clip-text text-transparent`}
            >
              {stat.value}
            </p>

            {/* Label */}
            <p className="text-gray-400 text-sm sm:text-base tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}