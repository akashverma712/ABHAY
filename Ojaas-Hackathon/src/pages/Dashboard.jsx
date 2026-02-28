import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

import useLiveLocation from "../hooks/useLiveLocation";

import Sidebar from "../components/Sidebar";
import LocationSection from "../components/LocationSection";
import CommunitySection from "../components/CommunitySection";
import SkillSection from "../components/SkillSection";
import SOSSection from "../components/SOSSection";
import ProfilePopup from "../components/ProfilePopup";
import ReportsSection from "../components/ReportsSection";

// ✅ NEW IMPORTS
import ReportIssueSection from "../components/ReportIssueSection";
import MyReportsSection from "../components/MyReportsSection";
import FeedbackSection from "../components/FeedbackSection"; // ✅ NEW

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("location");

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return navigate("/login");
      setUser(user);
    };

    init();
  }, [navigate]);

  const { position, timestamp } = useLiveLocation(user);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      <div className="flex-1 p-8 overflow-y-auto relative">
        {user && <ProfilePopup user={user} />}

        {activeTab === "location" && user && (
          <LocationSection
            user={user}
            position={position}
            timestamp={timestamp}
          />
        )}

        {activeTab === "community" && user && (
          <CommunitySection user={user} />
        )}

        {activeTab === "skills" && user && (
          <SkillSection user={user} />
        )}

        {activeTab === "sos" && user && position && (
          <SOSSection user={user} position={position} />
        )}

        {activeTab === "report" && user && position && (
          <ReportIssueSection
            user={user}
            position={position}
          />
        )}

        {activeTab === "myReports" && user && (
          <MyReportsSection user={user} />
        )}

        {activeTab === "reports" && user && (
          <ReportsSection user={user} />
        )}

        {/* ✅ NEW FEEDBACK ROUTE */}
        {activeTab === "feedback" && (
          <FeedbackSection />
        )}
      </div>
    </div>
  );
}