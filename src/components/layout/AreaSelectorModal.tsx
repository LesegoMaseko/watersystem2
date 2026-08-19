import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { useAreaStore } from '../../store/area.store';
import { Search, MapPin, Check, Plus, Home, Briefcase, Heart, Building2, Trash2 } from 'lucide-react';
import { Area, SavedArea } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const AreaSelectorModal: React.FC = () => {
  const {
    isAreaSelectorOpen,
    setIsAreaSelectorOpen,
    allAreas,
    currentArea,
    setCurrentArea,
    savedAreas,
    addSavedArea,
    removeSavedArea
  } = useAreaStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [showAddSaved, setShowAddSaved] = useState(false);
  const [customLabel, setCustomLabel] = useState('Home');
  const [selectedIcon, setSelectedIcon] = useState<SavedArea['icon']>('home');

  const filteredAreas = allAreas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.postalCode && a.postalCode.includes(searchTerm))
  );

  const handleSelect = (area: Area) => {
    setCurrentArea(area);
  };

  const handleSaveAreaSubmit = (areaId: string) => {
    if (!customLabel.trim()) return;
    addSavedArea(areaId, customLabel.trim(), selectedIcon);
    setShowAddSaved(false);
    setCustomLabel('Home');
  };

  return (
    <Modal
      isOpen={isAreaSelectorOpen}
      onClose={() => setIsAreaSelectorOpen(false)}
      title="Select Your Area"
      description="Choose an area in Gauteng to check real-time water availability and outages."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search suburb, city, or postal code (e.g. Sandton, Brixton, 2196)..."
            leftIcon={<Search className="w-4 h-4 text-slate-700" />}
            autoFocus
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-4 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-700 hover:text-slate-950'
            }`}
          >
            All Gauteng Areas ({allAreas.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-2 px-4 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-700 hover:text-slate-950'
            }`}
          >
            My Saved Locations ({savedAreas.length})
          </button>
        </div>

        {/* Tab 1: All Areas */}
        {activeTab === 'all' && (
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
            {filteredAreas.length === 0 ? (
              <div className="py-8 text-center text-slate-700 font-medium text-xs">
                No matching suburbs or areas found.
              </div>
            ) : (
              filteredAreas.map((area) => {
                const isSelected = currentArea.id === area.id;
                const isSaved = savedAreas.some((s) => s.areaId === area.id);

                return (
                  <div
                    key={area.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                    onClick={() => handleSelect(area)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 group-hover:text-blue-700'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-950">{area.name}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          {area.city} • Ward {area.wardNumber} {area.postalCode ? `• ${area.postalCode}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSaved && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addSavedArea(area.id, area.suburb, 'home');
                          }}
                          className="p-1.5 text-xs text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Save to My Areas"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Saved Areas */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Switch Locations
              </span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddSaved(!showAddSaved)}
              >
                {showAddSaved ? 'Cancel' : 'Add Location'}
              </Button>
            </div>

            {showAddSaved && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-900">Save an Area</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Label"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Home, Office, Mom's Place"
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Icon
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: 'home', icon: Home },
                        { id: 'briefcase', icon: Briefcase },
                        { id: 'heart', icon: Heart },
                        { id: 'map-pin', icon: Building2 }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedIcon(item.id as SavedArea['icon'])}
                            className={`p-2 rounded-lg border cursor-pointer ${
                              selectedIcon === item.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button size="sm" onClick={() => handleSaveAreaSubmit(currentArea.id)}>
                    Save Current Area ({currentArea.suburb})
                  </Button>
                </div>
              </div>
            )}

            <div className="divide-y divide-slate-100">
              {savedAreas.map((saved) => {
                const area = allAreas.find((a) => a.id === saved.areaId);
                if (!area) return null;
                const isSelected = currentArea.id === area.id;

                const getIcon = () => {
                  switch (saved.icon) {
                    case 'briefcase':
                      return <Briefcase className="w-4 h-4" />;
                    case 'heart':
                      return <Heart className="w-4 h-4" />;
                    case 'map-pin':
                      return <Building2 className="w-4 h-4" />;
                    default:
                      return <Home className="w-4 h-4" />;
                  }
                };

                return (
                  <div
                    key={saved.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-50 text-blue-950 font-bold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                    onClick={() => handleSelect(area)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {getIcon()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-950">{saved.label}</span>
                          <span className="text-xs text-slate-700 font-medium">({area.suburb})</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">{area.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedArea(saved.id);
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
