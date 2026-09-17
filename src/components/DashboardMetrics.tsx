import React from 'react';
import { Users, CheckCircle2, AlertTriangle, Award, FileSpreadsheet, Eye, Sparkles } from 'lucide-react';
import { Guest, EventMetadata } from '../types';

interface DashboardMetricsProps {
  guests: Guest[];
  event: EventMetadata;
  selectedCategory: string | null;
  onSelectCategoryFilter: (category: string | null) => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  guests,
  event,
  selectedCategory,
  onSelectCategoryFilter,
}) => {
  const total = guests.length;

  // Categories
  const highFitCount = guests.filter(g => g.analysis.category === '高度契合').length;
  const highFitRatio = total > 0 ? Math.round((highFitCount / total) * 100) : 0;

  const worthObservingCount = guests.filter(g => g.analysis.category === '值得觀察').length;
  const worthObservingRatio = total > 0 ? Math.round((worthObservingCount / total) * 100) : 0;

  const needConfirmCount = guests.filter(g => g.analysis.category === '需要確認').length;
  const needConfirmRatio = total > 0 ? Math.round((needConfirmCount / total) * 100) : 0;

  const notAlignedCount = guests.filter(g => g.analysis.category === '不符合本次活動條件').length;
  const notAlignedRatio = total > 0 ? Math.round((notAlignedCount / total) * 100) : 0;

  // Key stakeholder groups
  const vipOrMediaOrPartnerCount = guests.filter(
    g => g.guestType === 'vip' || g.guestType === 'media' || g.guestType === 'partner'
  ).length;
  const vipRatio = total > 0 ? Math.round((vipOrMediaOrPartnerCount / total) * 100) : 0;

  // Post-event observation logs count
  const postEventLoggedCount = guests.filter(g => Boolean(g.postEventRecord)).length;
  const postEventRatio = total > 0 ? Math.round((postEventLoggedCount / total) * 100) : 0;

  return (
    <section className="space-y-4">
      {/* Top 4 Key Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Guests */}
        <div
          id="metric-card-total"
          onClick={() => onSelectCategoryFilter(null)}
          className={`cursor-pointer bg-white p-4 rounded-xl border transition-all ${
            selectedCategory === null
              ? 'border-blue-600 ring-2 ring-blue-500/10 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              總報名人數
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{total}</span>
            <span className="text-xs text-slate-500">
              / 上限 {event.maxCapacity} 人
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>額滿進度</span>
            <span className="font-semibold text-slate-700">
              {Math.min(100, Math.round((total / event.maxCapacity) * 100))}%
            </span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-700 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, (total / event.maxCapacity) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: High Alignment Ratio */}
        <div
          id="metric-card-high-fit"
          onClick={() => onSelectCategoryFilter('高度契合')}
          className={`cursor-pointer bg-white p-4 rounded-xl border transition-all ${
            selectedCategory === '高度契合'
              ? 'border-emerald-600 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              高度契合比例
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-950 font-mono">{highFitRatio}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {highFitCount} 位
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-800 flex items-center justify-between">
            <span>契合度 ≥ 80 分</span>
            <span className="font-medium text-slate-500">優先核發席位</span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all"
              style={{ width: `${highFitRatio}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Needs Human Verification Ratio */}
        <div
          id="metric-card-need-confirm"
          onClick={() => onSelectCategoryFilter('需要確認')}
          className={`cursor-pointer bg-white p-4 rounded-xl border transition-all ${
            selectedCategory === '需要確認'
              ? 'border-amber-600 ring-2 ring-amber-500/10 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              需要人工確認比例
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-950 font-mono">{needConfirmRatio}%</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              {needConfirmCount} 件待確認
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-800 flex items-center justify-between">
            <span>異常/重複/動機待補</span>
            <span className="font-medium text-amber-700">交由主辦方判斷</span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all"
              style={{ width: `${needConfirmRatio}%` }}
            />
          </div>
        </div>

        {/* Metric 4: VIP / Partner / Media Ratio */}
        <div
          id="metric-card-vip"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
              VIP / 合作夥伴 / 媒體
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-950 font-mono">{vipRatio}%</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              {vipOrMediaOrPartnerCount} 位關鍵貴賓
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>專屬接待 & 觀察追蹤</span>
            <span className="text-xs font-medium text-blue-600">
              已留存 {postEventLoggedCount} 筆觀察紀錄
            </span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${vipRatio}%` }}
            />
          </div>
        </div>
      </div>

      {/* Structured Category Breakdown Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>來賓結構分佈光譜</span>
              <span className="text-xs font-normal text-slate-500">（點擊標籤可快速切換篩選名單）</span>
            </h2>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>高度契合
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 ml-2"></span>值得觀察
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-2"></span>需要確認
            <span className="inline-block w-2 h-2 rounded-full bg-slate-400 ml-2"></span>不符條件
          </div>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="mt-3 w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {highFitRatio > 0 && (
            <div
              style={{ width: `${highFitRatio}%` }}
              className="bg-emerald-500 hover:bg-emerald-600 transition-all"
              title={`高度契合: ${highFitCount} 人 (${highFitRatio}%)`}
            />
          )}
          {worthObservingRatio > 0 && (
            <div
              style={{ width: `${worthObservingRatio}%` }}
              className="bg-indigo-500 hover:bg-indigo-600 transition-all"
              title={`值得觀察: ${worthObservingCount} 人 (${worthObservingRatio}%)`}
            />
          )}
          {needConfirmRatio > 0 && (
            <div
              style={{ width: `${needConfirmRatio}%` }}
              className="bg-amber-500 hover:bg-amber-600 transition-all"
              title={`需要確認: ${needConfirmCount} 人 (${needConfirmRatio}%)`}
            />
          )}
          {notAlignedRatio > 0 && (
            <div
              style={{ width: `${notAlignedRatio}%` }}
              className="bg-slate-400 hover:bg-slate-500 transition-all"
              title={`不符合本次活動條件: ${notAlignedCount} 人 (${notAlignedRatio}%)`}
            />
          )}
        </div>

        {/* Category Clickable Pills */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <button
            onClick={() => onSelectCategoryFilter(selectedCategory === '高度契合' ? null : '高度契合')}
            className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
              selectedCategory === '高度契合'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              高度契合
            </span>
            <span className="font-mono font-bold text-emerald-800">{highFitCount}</span>
          </button>

          <button
            onClick={() => onSelectCategoryFilter(selectedCategory === '值得觀察' ? null : '值得觀察')}
            className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
              selectedCategory === '值得觀察'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              值得觀察
            </span>
            <span className="font-mono font-bold text-indigo-800">{worthObservingCount}</span>
          </button>

          <button
            onClick={() => onSelectCategoryFilter(selectedCategory === '需要確認' ? null : '需要確認')}
            className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
              selectedCategory === '需要確認'
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              需要確認
            </span>
            <span className="font-mono font-bold text-amber-800">{needConfirmCount}</span>
          </button>

          <button
            onClick={() => onSelectCategoryFilter(selectedCategory === '不符合本次活動條件' ? null : '不符合本次活動條件')}
            className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
              selectedCategory === '不符合本次活動條件'
                ? 'bg-slate-200 border-slate-400 text-slate-900 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              不符合本次活動條件
            </span>
            <span className="font-mono font-bold text-slate-800">{notAlignedCount}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
