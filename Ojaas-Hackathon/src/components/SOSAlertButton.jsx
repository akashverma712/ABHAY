import React, { useState, useEffect, useRef } from "react";

export default function SOSAlertButton({ user, position }) {
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const triggeredRef = useRef(false);

  const sendSOS = async () => {
    try {
      if (loading) return;
      setLoading(true);

      const response = await fetch("http://localhost:3000/send-sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.name || "Unknown User",
          latitude: position?.lat || position?.coords?.latitude,
          longitude: position?.lng || position?.coords?.longitude,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("🚨 SOS Sent Successfully!");
      } else {
        alert("Failed to send SOS");
      }
    } catch (error) {
      alert("Error sending SOS");
    } finally {
      setLoading(false);

      setTimeout(() => {
        triggeredRef.current = false;
      }, 5000);
    }
  };

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Speech Recognition not supported");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

      if (
        (transcript.includes("help") ||
          transcript.includes("NIT")) &&
        !triggeredRef.current
      ) {
        triggeredRef.current = true;
        sendSOS();
      }
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center py-10">

      {/* 🔥 Outer Pulse Rings */}
      {!loading && (
        <>
          <span className="absolute w-72 h-72 rounded-full bg-red-500 opacity-30 animate-ping"></span>
          <span className="absolute w-96 h-96 rounded-full bg-red-400 opacity-20 animate-ping animation-delay-1000"></span>
        </>
      )}

      {/* 🔥 Bigger Button */}
      <button
        onClick={sendSOS}
        disabled={loading}
        className={`relative z-10 
          w-48 h-48 md:w-56 md:h-56
          rounded-full 
          bg-gradient-to-br from-red-600 to-red-800 
          shadow-[0_0_60px_rgba(255,0,0,0.6)]
          text-white font-extrabold 
          text-2xl md:text-3xl
          flex items-center justify-center
          transition-all duration-300
          ${loading ? "scale-95" : "hover:scale-110 active:scale-95"}
        `}
      >
        {loading ? "Sending..." : "🚨 SOS"}
      </button>
    </div>
  );
}