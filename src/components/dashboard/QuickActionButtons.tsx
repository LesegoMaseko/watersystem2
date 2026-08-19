import React from 'react';
import { PlusCircle, Calendar, Waves, MessageSquare, PhoneCall, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/card';

interface QuickActionButtonsProps {
  onOpenReportWizard: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToReservoirs: () => void;
  onNavigateToCommunity: () => void;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onOpenReportWizard,
  onNavigateToSchedule,
  onNavigateToReservoirs,
  onNavigateToCommunity
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <button
        type="button"
        onClick={onOpenReportWizard}
        className="p-5 rounded-[20px] bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-[0.98]"
      >
        <div className="p-2.5 rounded-xl bg-white/20 w-fit">
          <PlusCircle className="w-5 h-5 text-white" />
        </div>
        <div className="mt-4">
          <span className="font-bold text-sm block">Report a Fault</span>
          <span className="text-xs text-blue-100 block mt-0.5 font-medium">
            Burst pipe, no water, leaks
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onNavigateToSchedule}
        className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-[0.98]"
      >
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 w-fit">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="mt-4">
          <span className="font-bold text-sm text-slate-950 block">
            Outage Schedule
          </span>
          <span className="text-xs text-slate-700 font-medium block mt-0.5">
            7-day maintenance plan
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onNavigateToReservoirs}
        className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-[0.98]"
      >
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 w-fit">
          <Waves className="w-5 h-5" />
        </div>
        <div className="mt-4">
          <span className="font-bold text-sm text-slate-950 block">
            Reservoirs & Towers
          </span>
          <span className="text-xs text-slate-700 font-medium block mt-0.5">
            Capacity & daily trends
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onNavigateToCommunity}
        className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-[0.98]"
      >
        <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 w-fit">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="mt-4">
          <span className="font-bold text-sm text-slate-950 block">
            Civic Community
          </span>
          <span className="text-xs text-slate-700 font-medium block mt-0.5">
            Verified councilor updates
          </span>
        </div>
      </button>
    </div>
  );
};
