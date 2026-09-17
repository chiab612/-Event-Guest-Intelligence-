import React, { useState } from 'react';
import { Sparkles, Shield, Users, Plus, Info, Calendar, MapPin } from 'lucide-react';
import { EventMetadata } from '../types';

interface HeaderProps {
  event: EventMetadata;
  onOpenAddModal: () => void;
  onOpenPhilosophyModal: () => void;
  guestCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  event,
  onOpenAddModal,
  onOpenPhilosophyModal,
  guestCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Subtitle */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner shadow-white/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    Event Guest Intelligence
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                    活動優化師 專業系統
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                  讓品牌不只管理報名，而是理解來賓。
                </p>
              </div>
            </div>

            {/* Event pill */}
            <div className="mt-2.5 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center text-slate-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>
                當前活動：{event.name}
              </span>
              <span className="hidden lg:inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {event.date}
              </span>
              <span className="hidden xl:inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {event.location}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              id="btn-philosophy"
              onClick={onOpenPhilosophyModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              title="了解活動優化師核心定位"
            >
              <Info className="w-4 h-4 text-blue-400" />
              <span>活動優化師理念</span>
            </button>

            <button
              id="btn-add-guest"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm hover:shadow-blue-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>新增來賓報名</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
