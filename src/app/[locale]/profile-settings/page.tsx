import { redirect } from 'next/navigation';

export default function ProfileSettingsIndexPage() {
  redirect('/profile-settings/edit-profile');
}
