import { useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";
import ProfileCard from "../../components/profile/ProfileCard.jsx";
import StatsCard from "../../components/profile/StatsCard.jsx";
import DetailsCard from "../../components/profile/DetailsCard.jsx";
import AchievementCard from "../../components/profile/AchievementCard.jsx";
import TimelineCard from "../../components/profile/TimelineCard.jsx";
import UploadPictureModal from "../../components/profile/UploadPictureModal.jsx";
import { achievements, activityTimeline, quickStats } from "../../mock-data/mockUser.js";
import { fileToDataUrl, updateProfile, useProfile } from "../../services/profileService.js";

export default function ProfilePage() {
  const { data: user, loading, error, reload } = useProfile();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const saveAvatar = async (file) =>
    updateProfile({ avatar: await fileToDataUrl(file) });

  if (loading) {
    return (
      <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-800">
        <LoaderCircle className="mx-auto animate-spin text-brand-600" />
        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-800">
        <AlertCircle className="mx-auto text-red-600 dark:text-red-400" />
        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
          We could not load your profile.
        </p>
        <button
          type="button"
          onClick={reload}
          className="mt-3 text-sm font-semibold text-brand-600 underline dark:text-brand-400"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileCard
        user={user}
        onAvatarClick={() => setShowUploadModal(true)}
      />
      <UploadPictureModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        currentAvatar={user.avatar}
        onSave={saveAvatar}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {quickStats.map((stat, index) => (
          <StatsCard key={stat.label} {...stat} index={index} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <DetailsCard user={user} />
          <AchievementCard data={achievements} />
        </div>
        <div className="lg:col-span-2">
          <TimelineCard items={activityTimeline} />
        </div>
      </div>
    </div>
  );
}
