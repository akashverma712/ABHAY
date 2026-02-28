import SOSAlertButton from "./SOSAlertButton";
import SOSListener from "./SOSListener";
import EmergencyAssistant from "./EmergencyAssistant";

export default function SOSSection({ user, position }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Emergency SOS</h2>

      <SOSAlertButton user={user} position={position} />
      <SOSListener user={user} position={position} />

      <EmergencyAssistant position={position} />
    </div>
  );
}