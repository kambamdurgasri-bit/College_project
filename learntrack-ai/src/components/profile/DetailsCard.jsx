import {
  Cake,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  User,
  VenetianMask,
} from "lucide-react";
import SectionTitle from "../ui/SectionTitle.jsx";
import { InfoField } from "../ui/InfoField.jsx";
import SectionCard from "./SectionCard.jsx";

export default function DetailsCard({ user }) {
  return (
    <SectionCard>
      <SectionTitle
        title="Profile Details"
        subtitle="Personal and academic information"
      />
      <div className="grid divide-y divide-slate-200 dark:divide-slate-700 sm:grid-cols-2 sm:divide-y-0">
        <InfoField label="Full Name" value={user.fullName} icon={User} />
        <InfoField label="Email" value={user.email} icon={Mail} />
        <InfoField label="Phone" value={user.phone} icon={Phone} />
        <InfoField
          label="Date of Birth"
          value={new Date(user.dob).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          icon={Cake}
        />
        <InfoField label="Gender" value={user.gender} icon={VenetianMask} />
        <InfoField label="University" value={user.university} icon={Building2} />
        <InfoField label="Branch" value={user.branch} icon={GraduationCap} />
        <InfoField
          label="Department"
          value={user.department}
          icon={GraduationCap}
        />
      </div>
      <div className="mt-3 border-t border-slate-200 pt-4 dark:border-slate-700">
        <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          About Me
        </p>
        <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-300">
          {user.about}
        </p>
      </div>
    </SectionCard>
  );
}
