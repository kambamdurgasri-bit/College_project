import { useState } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import ProfileCard from '../../components/profile/ProfileCard';
import StatsCard from '../../components/profile/StatsCard';
import DetailsCard from '../../components/profile/DetailsCard';
import AchievementCard from '../../components/profile/AchievementCard';
import TimelineCard from '../../components/profile/TimelineCard';
import UploadPictureModal from '../../components/profile/UploadPictureModal';
import { quickStats, achievements, activityTimeline } from '../../data/profile/mockUser';
import { fileToDataUrl, updateProfile, useProfile } from '../../services/profileService';

export default function Profile() {
  const { data: user, loading, error, reload } = useProfile();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const saveAvatar = async (file) => {
    const avatar = await fileToDataUrl(file);
    await updateProfile({ avatar });
  };

  if (loading) return <ProfileState label="Loading profile..." loading />;
  if (error || !user) {
    return <ProfileState label="We couldn’t load your profile." onRetry={reload} />;
  }

  return (
    <div className="space-y-6">
      <ProfileCard user={user} onAvatarClick={() => setShowUploadModal(true)} />

      <UploadPictureModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        currentAvatar={user.avatar}
        onSave={saveAvatar}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickStats.map((stat, i) => (
          <StatsCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
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

function ProfileState({ label, loading = false, onRetry }) {
  return (
    <div role={loading ? undefined : 'alert'} className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-8 text-center shadow-soft dark:shadow-softDark">
      {loading ? <LoaderCircle className="mx-auto animate-spin text-primary" aria-hidden="true" /> : <AlertCircle className="mx-auto text-danger dark:text-dark-danger" aria-hidden="true" />}
      <p className="mt-3 text-sm font-semibold text-textPrimary dark:text-dark-text">{label}</p>
      {!loading && <button type="button" onClick={onRetry} className="mt-3 text-sm font-semibold text-primary underline dark:text-dark-accent">Try again</button>}
    </div>
  );
}
