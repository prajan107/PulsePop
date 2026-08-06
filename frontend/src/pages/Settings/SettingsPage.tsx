import React, { useState } from 'react';
import { 
  User, 
  Paintbrush, 
  Bell, 
  Key, 
  Save, 
  Copy, 
  Check, 
  Plus, 
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MOCK_USER } from '@/mocks/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Toast } from '@/components/ui/toast';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'security'>('profile');
  const [user, setUser] = useState(MOCK_USER);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopy = (keyText: string, keyId: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Settings successfully updated.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast title="Success" description={toastMessage} type="success" onClose={() => setToastMessage(null)} />
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Account & SaaS Settings <Sparkles className="h-6 w-6 text-[#6366F1]" />
        </h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Manage your personal profile, notification webhooks, API tokens, and workspace preferences.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-[#1F2937] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'appearance'
              ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <Paintbrush className="h-4 w-4" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'notifications'
              ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'security'
              ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30'
              : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <Key className="h-4 w-4" />
          <span>Security & API Keys</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="border-[#1F2937] bg-[#111827]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Personal Profile</CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">Update your public information and avatar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-[#6366F1]">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" type="button" className="border-[#1F2937] text-xs">
                    Change Avatar
                  </Button>
                  <p className="text-[11px] text-[#64748B] mt-1">JPG or PNG under 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Full Name</label>
                  <Input
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Email Address</label>
                  <Input
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Role Title</label>
                  <Input
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Company / Organization</label>
                  <Input
                    value={user.company}
                    onChange={(e) => setUser({ ...user, company: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Bio</label>
                <textarea
                  rows={3}
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="w-full rounded-lg border border-[#1F2937] bg-[#0F172A] p-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              </div>

              <Button type="submit" className="bg-[#6366F1] text-white">
                <Save className="mr-2 h-4 w-4" /> Save Profile Changes
              </Button>
            </CardContent>
          </Card>
        </form>
      )}

      {activeTab === 'appearance' && (
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Appearance & Theme</CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">Customize the visual style of your workspace dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] mb-3 block">Theme Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border-2 border-[#6366F1] bg-[#0F172A] p-4 cursor-pointer space-y-2">
                  <div className="h-20 rounded bg-[#111827] border border-[#1F2937] p-2 space-y-1">
                    <div className="h-2 w-12 bg-[#6366F1] rounded" />
                    <div className="h-2 w-20 bg-[#1F2937] rounded" />
                  </div>
                  <span className="font-semibold text-xs text-white block">Dark Slate (Default)</span>
                </div>
                <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-4 cursor-pointer space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="h-20 rounded bg-[#1E293B] border border-[#374151] p-2 space-y-1">
                    <div className="h-2 w-12 bg-[#3B82F6] rounded" />
                    <div className="h-2 w-20 bg-[#374151] rounded" />
                  </div>
                  <span className="font-semibold text-xs text-white block">Midnight Blue</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Notification Channels</CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">Configure how and where automated alert triggers are delivered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                <div>
                  <p className="font-semibold text-xs text-white">Email Digest Alerts</p>
                  <p className="text-[11px] text-[#94A3B8]">Send real-time alert trigger summary emails to {user.email}</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.notificationsConfig.emailAlerts}
                  onChange={(e) => setUser({
                    ...user,
                    notificationsConfig: { ...user.notificationsConfig, emailAlerts: e.target.checked }
                  })}
                  className="h-4 w-4 accent-[#6366F1]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                <div>
                  <p className="font-semibold text-xs text-white">Slack Webhook Dispatch</p>
                  <p className="text-[11px] text-[#94A3B8]">Post alert payloads directly to specified Slack channel</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.notificationsConfig.slackAlerts}
                  onChange={(e) => setUser({
                    ...user,
                    notificationsConfig: { ...user.notificationsConfig, slackAlerts: e.target.checked }
                  })}
                  className="h-4 w-4 accent-[#6366F1]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Slack Webhook URL</label>
                <Input
                  value={user.notificationsConfig.webhookUrl}
                  onChange={(e) => setUser({
                    ...user,
                    notificationsConfig: { ...user.notificationsConfig, webhookUrl: e.target.value }
                  })}
                />
              </div>
            </div>

            <Button onClick={handleSave} className="bg-[#6366F1] text-white">
              Save Notification Preferences
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="border-[#1F2937] bg-[#111827]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-white">API Tokens & Access Keys</CardTitle>
                <CardDescription className="text-xs text-[#94A3B8]">Programmatically access PulsePop trend signal APIs</CardDescription>
              </div>
              <Button size="sm" className="bg-[#6366F1] text-xs text-white">
                <Plus className="mr-1 h-3.5 w-3.5" /> Generate New Key
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.apiKeys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] border border-[#1F2937]">
                  <div>
                    <p className="font-semibold text-xs text-white">{k.name}</p>
                    <code className="text-xs font-mono text-[#818CF8]">{k.key}</code>
                    <p className="text-[10px] text-[#64748B] mt-0.5">Created {k.created} • Last used {k.lastUsed}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(k.key, k.id)}
                    className="text-xs text-[#94A3B8] hover:text-white"
                  >
                    {copiedKey === k.id ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
