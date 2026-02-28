import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesPanel from "./FeaturesPanel";
import BackgroundEffects from "./BackgroundEffects";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#0a0f1c] text-white overflow-hidden">

      {/* Background Layer */}
      <BackgroundEffects />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28">
          <div className="max-w-7xl mx-auto">
            <HeroSection />
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28 lg:mt-36 pb-20">
          <div className="max-w-7xl mx-auto">
            <FeaturesPanel />
          </div>
        </section>

      </main>
    </div>
  );
}