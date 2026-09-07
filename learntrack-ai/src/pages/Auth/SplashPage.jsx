import { useNavigate } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15">
        <GraduationCap size={36} className="text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">LearnTrack AI</h1>
        <p className="mt-2 text-sm text-white/80">
          Your AI-powered study and progress companion
        </p>
      </div>
      <button
        onClick={() => navigate("/login")}
        className="mt-4 flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700"
      >
        Get Started <ArrowRight size={16} />
      </button>
    </div>
  );
}
