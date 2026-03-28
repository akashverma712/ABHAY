import SkillVerificationForm from "./SkillVerfication";

export default function SkillSection({ user }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Skill Verification</h2>
      <SkillVerificationForm user={user} />
    </div>
  );
}