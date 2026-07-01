'use client';

import { Button, Card, ConfirmDialog, Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { authService } from '@/services/auth.service';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await authService.changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = () => setShowDeleteConfirm(true);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input
            id="settings-name"
            label="Name"
            value={profileData.name}
            onChange={(e) =>
              setProfileData((p) => ({ ...p, name: e.target.value }))
            }
          />
          <Input
            id="settings-email"
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData((p) => ({ ...p, email: e.target.value }))
            }
          />
          <Button type="submit">Update Profile</Button>
        </form>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            id="current-password"
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((p) => ({
                ...p,
                currentPassword: e.target.value,
              }))
            }
            required
          />
          <Input
            id="new-password"
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
            }
            required
            minLength={6}
          />
          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
          >
            Dark
          </Button>
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            onClick={() => setTheme('system')}
          >
            System
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-6 border-destructive/20">
        <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back.
        </p>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed."
        confirmLabel="Delete Account"
        onConfirm={deleteAccount}
      />
    </div>
  );
}
