import { useState } from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import StatsCard from '../components/profile/StatsCard';
import DetailsCard from '../components/profile/DetailsCard';
import AchievementCard from '../components/profile/AchievementCard';
import TimelineCard from '../components/profile/TimelineCard';
import UploadPictureModal from '../components/profile/UploadPictureModal';
import { mockUser, quickStats, achievements, activityTimeline } from '../data/mockUser';

export default function Profile() {
  const [avatar, setAvatar] = useState(mockUser.avatar);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const user = { ...mockUser, avatar };

  return (
    <div className="space-y-6">
      <ProfileCard user={user} onAvatarClick={() => setShowUploadModal(true)} />

      <UploadPictureModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        currentAvatar={avatar}
        onSave={setAvatar}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickStats.map((stat, i) => (
          <StatsCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <DetailsCard user={mockUser} />
          <AchievementCard data={achievements} />
        </div>
        <div className="lg:col-span-2">
          <TimelineCard items={activityTimeline} />
        </div>
      </div>
    </div>
  );
}
