import { ProfileSettings } from '@green-world/views/ProfileSettings';

export default function ProfileSettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ProfileSettings>{children}</ProfileSettings>;
}
