import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MapPin,
  Camera,
  CheckCircle2,
  Copy,
  ArrowRight,
  ArrowLeft,
  Users,
  ShieldAlert,
  Droplets,
  HelpCircle,
  FileText,
  Sparkles,
  Phone,
  User,
  Crosshair
} from 'lucide-react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { IssueReport, IssueUrgency } from '../../types';
import { useAreaStore } from '../../store/area.store';
import { useReportStore } from '../../store/report.store';
import { reportService } from '../../services/report.service';
import { useToast } from '../../hooks/use-toast';

interface ReportWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackReport?: (reportId: string) => void;
}

const ISSUE_TYPES: Array<{
  id: IssueReport['type'];
  name: string;
  desc: string;
  defaultUrgency: IssueUrgency;
  iconColor: string;
}> = [
  {
    id: 'burst_pipe',
    name: 'Burst Trunk Pipe',
    desc: 'High pressure flooding on road or sidewalk.',
    defaultUrgency: 'critical',
    iconColor: 'text-rose-600'
  },
  {
    id: 'no_water',
    name: 'No Water / Dry Taps',
    desc: 'Complete absence of water supply to property.',
    defaultUrgency: 'high',
    iconColor: 'text-orange-600'
  },
  {
    id: 'low_pressure',
    name: 'Low Water Pressure',
    desc: 'Trickling taps, unable to fill geysers.',
    defaultUrgency: 'medium',
    iconColor: 'text-amber-600'
  },
  {
    id: 'water_leak',
    name: 'Potable Water Leak',
    desc: 'Underground meter leak or pavement stream.',
    defaultUrgency: 'medium',
    iconColor: 'text-blue-600'
  },
  {
    id: 'discoloured_water',
    name: 'Discoloured / Turbid Water',
    desc: 'Brown sediment or murky tap water.',
    defaultUrgency: 'low',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'meter_problem',
    name: 'Damaged Water Meter',
    desc: 'Faulty prepaid meter or leaking valve box.',
    defaultUrgency: 'low',
    iconColor: 'text-blue-600'
  },
  {
    id: 'open_hydrant',
    name: 'Open Fire Hydrant',
    desc: 'Potable water discharging from open street hydrant.',
    defaultUrgency: 'medium',
    iconColor: 'text-indigo-600'
  },
  {
    id: 'other',
    name: 'Other Water Infrastructure Issue',
    desc: 'Manhole leak, pump station noise, etc.',
    defaultUrgency: 'low',
    iconColor: 'text-slate-700'
  }
];

export const ReportWizardModal: React.FC<ReportWizardModalProps> = ({
  isOpen,
  onClose,
  onTrackReport
}) => {
  const { currentArea } = useAreaStore();
  const { submitReport, toggleSupport } = useReportStore();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedType, setSelectedType] = useState<IssueReport['type']>('burst_pipe');
  const [streetLocation, setStreetLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<IssueUrgency>('critical');
  const [reporterName, setReporterName] = useState('Ntando Sibaya');
  const [reporterPhone, setReporterPhone] = useState('+27 82 555 4910');
  const [hasPhoto, setHasPhoto] = useState(false);

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState<IssueReport[]>([]);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<IssueReport | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmittedReport(null);
      setDuplicates([]);
    }
  }, [isOpen]);

  // Check duplicates when entering Step 2 or changing street
  useEffect(() => {
    if (step === 2 && streetLocation.length > 2) {
      setIsCheckingDuplicates(true);
      const timer = setTimeout(async () => {
        const found = await reportService.checkDuplicates(currentArea.id, selectedType, streetLocation);
        setDuplicates(found);
        setIsCheckingDuplicates(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [step, streetLocation, currentArea.id, selectedType]);

  const selectedTypeObj = ISSUE_TYPES.find((t) => t.id === selectedType) || ISSUE_TYPES[0];

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setStreetLocation(`Near ${currentArea.suburb} Main Road (GPS Verified)`);
          showToast({
            type: 'info',
            title: 'GPS Coordinates Captured',
            message: 'Location tagged to current ward.'
          });
        },
        () => {
          setStreetLocation(`${currentArea.suburb} Central`);
        }
      );
    } else {
      setStreetLocation(`${currentArea.suburb} Central`);
    }
  };

  const handleSupportExisting = async (dupId: string) => {
    await toggleSupport(dupId);
    showToast({
      type: 'success',
      title: 'Report Supported (+1)',
      message: 'You have been added to the affected residents counter for this incident.'
    });
    if (onTrackReport) {
      onTrackReport(dupId);
    }
    onClose();
  };

  const handleSubmit = async () => {
    const report = await submitReport({
      type: selectedType,
      typeName: selectedTypeObj.name,
      areaId: currentArea.id,
      areaName: currentArea.name,
      streetLocation: streetLocation.trim() || `${currentArea.suburb} Sector 3`,
      description: description.trim() || 'No description provided.',
      urgency,
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim(),
      imageUrl: hasPhoto
        ? 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80'
        : undefined
    });

    setSubmittedReport(report);
    setStep(5);
    showToast({
      type: 'success',
      title: 'Ticket Created',
      message: `Reference: ${report.referenceNumber}`
    });
  };

  const handleCopyRef = () => {
    if (submittedReport) {
      navigator.clipboard.writeText(submittedReport.referenceNumber);
      showToast({
        type: 'info',
        title: 'Copied Reference Code',
        message: submittedReport.referenceNumber
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 5
          ? 'Ticket Logged Successfully'
          : `Report Water Issue (Step ${step} of 4)`
      }
      description={
        step === 5
          ? 'Your report is now assigned to the municipal depot queue.'
          : `Submitting civic incident for ${currentArea.name}.`
      }
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Step Progress Bar */}
        {step < 5 && (
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* STEP 1: Select Fault Type */}
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
              Select Issue Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {ISSUE_TYPES.map((type) => {
                const isSelected = selectedType === type.id;

                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setUrgency(type.defaultUrgency);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-bold text-slate-950">
                        {type.name}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${type.iconColor.replace('text-', 'bg-')}`} />
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1">
                      {type.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(2)}
              >
                Next: Location
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Duplicate Detection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Street Address or Nearest Landmark
                </label>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5" /> Use My Location
                </button>
              </div>
              <Input
                value={streetLocation}
                onChange={(e) => setStreetLocation(e.target.value)}
                placeholder="e.g. Corner Caroline St & High St, near Brixton Primary"
                leftIcon={<MapPin className="w-4 h-4" />}
                autoFocus
              />
              <p className="text-[11px] text-slate-700 font-semibold mt-1">
                Area: <strong className="text-slate-950">{currentArea.name}</strong> (Ward {currentArea.wardNumber})
              </p>
            </div>

            {/* DUPLICATE REPORT DETECTION ALERT */}
            {duplicates.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Similar Active Issue Detected Nearby
                    </span>
                    <p className="text-xs text-amber-900 font-medium mt-0.5">
                      There is already an open report for a <strong>{selectedTypeObj.name}</strong> near this location. Supporting an existing report helps dispatch teams prioritize faster.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-amber-200 pt-1">
                  {duplicates.slice(0, 2).map((dup) => (
                    <div key={dup.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-950">
                          #{dup.referenceNumber}
                        </span>
                        <span className="text-slate-700 font-medium ml-1.5">({dup.streetLocation})</span>
                        <span className="block text-[11px] text-amber-900 font-bold">
                          {dup.affectedPeopleCount} people affected • Status: {dup.status}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="amber"
                        leftIcon={<Users className="w-3.5 h-3.5" />}
                        onClick={() => handleSupportExisting(dup.id)}
                      >
                        Support (+1)
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(3)}
                disabled={!streetLocation.trim()}
              >
                Next: Fault Details
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Details & Contact */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Detailed Description of the Issue
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-950 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Describe volume of water leaking, water clarity, whether properties are flooded, duration..."
              />
            </div>

            {/* Urgency selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Severity / Urgency Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'low', label: 'Low', color: 'border-slate-300 text-slate-800' },
                  { id: 'medium', label: 'Medium', color: 'border-amber-400 text-amber-800' },
                  { id: 'high', label: 'High', color: 'border-orange-500 text-orange-800' },
                  { id: 'critical', label: 'Critical', color: 'border-rose-600 text-rose-800' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgency(item.id as IssueUrgency)}
                    className={`p-2 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                      urgency === item.id
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Reporter Full Name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Mobile Phone (for SMS updates)"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            {/* Photo upload toggle simulation */}
            <div className="p-3 rounded-xl border border-dashed border-slate-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 font-semibold text-slate-800">
                <Camera className="w-4 h-4 text-slate-600" />
                <span>Attach Photographic Evidence</span>
              </div>
              <Button
                size="sm"
                variant={hasPhoto ? 'primary' : 'outline'}
                onClick={() => setHasPhoto(!hasPhoto)}
              >
                {hasPhoto ? 'Photo Attached (1)' : '+ Add Photo'}
              </Button>
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(4)}
              >
                Next: Review
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Summary */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                <div>
                  <span className="font-bold text-slate-700 uppercase text-[10px]">Issue Type</span>
                  <p className="text-sm font-bold text-slate-950 mt-0.5">
                    {selectedTypeObj.name}
                  </p>
                </div>
                <Badge variant={urgency === 'critical' ? 'danger' : urgency === 'high' ? 'warning' : 'neutral'}>
                  {urgency.toUpperCase()} URGENCY
                </Badge>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase text-[10px]">Location</span>
                <p className="text-slate-950 font-semibold mt-0.5">
                  {streetLocation} ({currentArea.name})
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase text-[10px]">Details</span>
                <p className="text-slate-800 font-medium mt-0.5">
                  {description || 'No additional details.'}
                </p>
              </div>

              <div className="flex justify-between font-semibold text-slate-700 pt-2 border-t border-slate-200">
                <span>Reporter: {reporterName} ({reporterPhone})</span>
                <span>Photo: {hasPhoto ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Submitting logs your ticket directly into the Johannesburg Water Dispatch queue with priority routing.
              </span>
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setStep(3)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                Submit Official Report
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Success Screen */}
        {step === 5 && submittedReport && (
          <div className="py-4 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-950">
                Report Submitted Successfully
              </h3>
              <p className="text-xs font-semibold text-slate-700 mt-1 max-w-sm mx-auto">
                Your ticket has been generated and dispatched to the local maintenance depot.
              </p>
            </div>

            {/* Big Reference Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block max-w-sm w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                Reference Number
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-blue-700 tracking-wider">
                  {submittedReport.referenceNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="p-1.5 text-slate-700 hover:text-blue-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Copy reference code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => {
                  if (onTrackReport) onTrackReport(submittedReport.id);
                  onClose();
                }}
              >
                Track Live Repair Progress
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
