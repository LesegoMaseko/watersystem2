import React, { useState } from 'react';
import {
  User,
  MapPin,
  Bell,
  Moon,
  Sun,
  Laptop,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Download
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useUserStore } from '../../store/user.store';
import { useAreaStore } from '../../store/area.store';
import { useToast } from '../../hooks/use-toast';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, toggleNotificationPref } = useUserStore();
  const { savedAreas, allAreas, removeSavedArea, setIsAreaSelectorOpen } = useAreaStore();
  const { showToast } = useToast();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email });
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal and SMS dispatch contact details have been saved.'
    });
  };

  const handleExportData = () => {
    const data = {
      profile,
      savedAreas,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waterwatch-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast({
      type: 'info',
      title: 'Data Exported',
      message: 'Downloaded WaterWatch profile and telemetry archive.'
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
          <User className="w-6 h-6 text-blue-600" />
          Resident Profile & Preferences
        </h1>
        <p className="text-sm text-slate-700 font-medium mt-1">
          Manage saved municipal wards, alert thresholds, emergency SMS notifications, and system settings.
        </p>
      </div>

      {/* Profile Form */}
      <Card className="p-6">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Contact & SMS Alert Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ntando Sibaya"
              required
            />
            <Input
              label="Phone Number (for Urgent Outage SMS)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+27 82 555 4910"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="resident@example.co.za"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Saved Locations */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              My Saved Suburbs & Locations
            </h2>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Receive automatic outage alerts whenever supply changes for these addresses.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAreaSelectorOpen(true)}
          >
            Add Location
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedAreas.map((saved, idx) => {
            const area = allAreas.find((a) => a.id === saved.areaId);
            if (!area) return null;

            return (
              <div
                key={saved.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-950">
                      {saved.label}
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">
                    {area.name} (Ward {area.wardNumber})
                  </p>
                </div>

                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSavedArea(saved.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          Notification Channels & Toggles
        </h2>

        <div className="space-y-3 divide-y divide-slate-100 text-sm">
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-bold text-slate-950 block">
                Emergency Alerts (Instant Critical SMS)
              </span>
              <span className="text-xs text-slate-700 font-medium">
                Immediate notification when burst pipes cause unplanned tap dry-offs.
              </span>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationPreferences.emergencyAlerts}
              onChange={() => toggleNotificationPref('emergencyAlerts')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-bold text-slate-950 block">
                Scheduled Maintenance Warnings (12h in Advance)
              </span>
              <span className="text-xs text-slate-700 font-medium">
                Advance warning for planned pipe valve replacements and reservoir cleaning.
              </span>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationPreferences.outageAlerts}
              onChange={() => toggleNotificationPref('outageAlerts')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-bold text-slate-950 block">
                Water Tanker Deployments
              </span>
              <span className="text-xs text-slate-700 font-medium">
                Locations and arrival times for municipal water distribution trucks.
              </span>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationPreferences.tankerAlerts}
              onChange={() => toggleNotificationPref('tankerAlerts')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-bold text-slate-950 block">
                Community & Verified Councilor Dispatches
              </span>
              <span className="text-xs text-slate-700 font-medium">
                Daily summaries of restored streets and councilor updates.
              </span>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationPreferences.communityUpdates}
              onChange={() => toggleNotificationPref('communityUpdates')}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Official Directory & Emergency Helplines */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-600" />
          Official Municipal Water Helplines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-950 block">Joburg Water 24/7 Call Centre</span>
            <p className="text-blue-700 font-mono font-black text-sm">011 688 1699</p>
            <p className="text-slate-700 font-medium">customer@jwater.co.za</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-950 block">Joburg Water WhatsApp Faults</span>
            <p className="text-blue-700 font-mono font-black text-sm">+27 74 972 5808</p>
            <p className="text-slate-700 font-medium">Send GPS & photo report</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-950 block">City of Tshwane Water Desk</span>
            <p className="text-blue-700 font-mono font-black text-sm">012 358 9999</p>
            <p className="text-slate-700 font-medium">watercare@tshwane.gov.za</p>
          </div>
        </div>
      </Card>

      {/* Export & Data Backup */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleExportData}
        >
          Export Profile & Telemetry Archive
        </Button>
      </div>
    </div>
  );
};
