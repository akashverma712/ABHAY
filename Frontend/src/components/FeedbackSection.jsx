import { QrCode } from "lucide-react";

export default function FeedbackSection() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-3xl 
                    bg-white/5 backdrop-blur-xl 
                    border border-white/10 text-white shadow-2xl">

      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2 
                     bg-gradient-to-r from-purple-400 to-blue-500 
                     bg-clip-text text-transparent">
        Feedback & Contact
      </h2>

      <p className="text-white/50 mb-8">
        For any form contact us by scanning the QR code below.
      </p>

      {/* QR Card */}
      <div className="flex flex-col items-center justify-center 
                      p-8 rounded-2xl
                      bg-purple-500/10 
                      border border-purple-500/30">

        <QrCode className="text-purple-400 mb-4" size={32} />

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <img
            src="/qr.png"
            alt="QR Code"
            className="w-64 h-64 object-contain"
          />
        </div>

        <p className="text-purple-300 text-sm mt-6 text-center">
          Scan this QR to open the contact form.
        </p>
      </div>

    </div>
  );
}