import { Camera, GraduationCap, Building2, BarChart2, Mail, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../ui/AnimatedButton.jsx";
import SectionCard from "./SectionCard.jsx";

export default function ProfileCard({ user, onAvatarClick }) {
  const navigate = useNavigate();
  return (
    <SectionCard className="relative overflow-hidden bg-brand-50/60 p-6 dark:bg-brand-500/10 sm:p-8">
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <div className="h-28 w-28 rounded-full bg-brand-400 p-1">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-full w-full rounded-full bg-white object-cover dark:bg-slate-700"
            />
          </div>
          <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
          <button
            type="button"
            onClick={onAvatarClick}
            aria-label="Update profile picture"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-600 shadow-md dark:bg-slate-700 dark:text-brand-300"
          >
            <Camera size={14} />
          </button>
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {user.fullName}
          </h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 sm:justify-start">
            <Mail size={14} />
            {user.email}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Chip icon={Building2} label={user.university} />
            <Chip icon={GraduationCap} label={user.branch} />
            <Chip icon={BarChart2} label={`Level: ${user.learningLevel}`} />
          </div>
        </div>
        <AnimatedButton
          icon={Pencil}
          onClick={() => navigate("/profile/edit")}
          className="shrink-0"
        >
          Edit Profile
        </AnimatedButton>
      </div>
    </SectionCard>
  );
}

function Chip({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-900 dark:border-slate-600 dark:bg-slate-700/80 dark:text-white">
      <Icon size={13} className="text-brand-600 dark:text-brand-400" />
      {label}
    </span>
  );
}
