import { Shield, MapPin, Users, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FeaturesPanel() {
  const { t } = useTranslation();

  return (
    <div
      className="bg-white/5 backdrop-blur-2xl border border-white/10 
                 rounded-3xl p-6 sm:p-8 lg:p-12 
                 shadow-2xl relative z-10"
    >
      <h2
        className="text-xl sm:text-2xl lg:text-3xl 
                   font-semibold mb-8 sm:mb-10 lg:mb-12 
                   text-center"
      >
        {t("features_title")}
      </h2>

      <div className="grid gap-8 sm:gap-10">

        {/* Feature 1 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Siren size={24} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              {t("feature1_title")}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("feature1_desc")}
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <MapPin size={24} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              {t("feature2_title")}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("feature2_desc")}
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <Users size={24} className="text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              {t("feature3_title")}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("feature3_desc")}
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <Shield size={24} className="text-pink-400" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              {t("feature4_title")}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t("feature4_desc")}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}