import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StatsSection from "./StatsSection";

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">

        {/* Tagline */}
        <div className="text-center lg:text-left">
          <p
            className="
              inline-block
              px-4 py-1.5
              text-xs sm:text-sm
              rounded-full
              bg-white/10
              border border-white/20
              text-gray-300
              mb-6 sm:mb-8
            "
          >
            {t("tagline")}
          </p>
        </div>

        {/* Heading */}
        <h1
          className="
            text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
            font-bold
            leading-[1.1]
            tracking-tight
            mb-6 sm:mb-8
            text-center lg:text-left
          "
        >
          {t("hero_title_1")}
          <br className="hidden sm:block" />
          {t("hero_title_2")}
          <span
            className="
              block
              mt-2
              bg-gradient-to-r
              from-purple-400
              to-blue-500
              bg-clip-text
              text-transparent
            "
          >
            {t("hero_highlight")}
          </span>
        </h1>

        {/* Description */}
        <p
          className="
            text-gray-400
            text-base sm:text-lg md:text-xl
            leading-relaxed
            max-w-2xl
            mb-10 sm:mb-12
            mx-auto lg:mx-0
            text-center lg:text-left
          "
        >
          {t("hero_description")}
        </p>

        {/* Buttons */}
        <div
          className="
            flex
            flex-col sm:flex-row
            gap-4 sm:gap-6
            justify-center lg:justify-start
            mb-16 sm:mb-20
          "
        >
          <button
            onClick={() => navigate("/login")}
            className="
              px-8 py-3.5
              rounded-xl
              font-medium
              bg-gradient-to-r
              from-purple-600
              to-blue-600
              hover:scale-105
              hover:shadow-2xl
              transition-all
              duration-300
              w-full sm:w-auto
            "
          >
            {t("activate")}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="
              px-8 py-3.5
              rounded-xl
              border border-white/20
              hover:bg-white/10
              hover:shadow-lg
              transition-all
              duration-300
              w-full sm:w-auto
            "
          >
            {t("explore")}
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-10 sm:mt-14">
          <StatsSection />
        </div>

      </div>
    </section>
  );
}