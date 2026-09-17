import React, { useState } from 'react';
import { 
  FileText, 
  Star, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  UserCheck, 
  Building2, 
  ArrowRight,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { Guest } from '../types';

interface PostEventObservationSectionProps {
  guests: Guest[];
  onOpenGuestDetail: (guest: Guest) => void;
}

export const PostEventObservationSection: React.FC<PostEventObservationSectionProps> = ({
  guests,
  onOpenGuestDetail,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'attended' | 'has_value'>('all');

  const guestsWithRecords = guests.filter(g => Boolean(g.postEventRecord));

  const filtered = guestsWithRecords.filter(g => {
    if (!g.postEventRecord) return false;
    if (filterType === 'attended' && !g.postEventRecord.attended) return false;
    if (filterType === 'has_value' && !g.postEventRecord.brandValueOutcome) return false;
    return true;
  });

  const averageRating = guestsWithRecords.length > 0
    ? (guestsWithRecords.reduce((acc, g) => acc + (g.postEventRecord?.engagementScore || 0), 0) / guestsWithRecords.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              活動結束後的延伸價值
            </span>
            <span className="text-2xs text-slate-400">
              現場觀察 × 深度回饋 × 關係留存
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>活動結束後的回饋與現場觀察紀錄</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            紀錄來賓實際出席互動、探討主題的深度，以及為品牌留存的長期商業與合作資產。
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 self-start md:self-center">
          <div className="text-center pr-3 border-r border-slate-700">
            <span className="text-2xs text-slate-400 block">已登錄觀察紀錄</span>
            <span className="font-mono text-xl font-bold text-white">{guestsWithRecords.length} 筆</span>
          </div>
          <div className="text-center pl-1">
            <span className="text-2xs text-slate-400 block">平均互動滿意度</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xl font-bold text-amber-300">{averageRating}</span>
              <span className="text-2xs text-slate-400">/ 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-600">檢視篩選：</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            全部紀錄 ({guestsWithRecords.length})
          </button>
          <button
            onClick={() => setFilterType('attended')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'attended'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            準時／實際出席
          </button>
        </div>
        <span className="text-2xs text-slate-500 hidden sm:inline">
          點擊卡片可編輯或擴充紀錄項目
        </span>
      </div>

      {/* Cards List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-medium text-slate-700">目前尚無此篩選類別的活動後觀察紀錄</p>
          <p className="text-slate-400 mt-0.5">點擊任一名單來賓檔案，切換至「活動後回饋」頁籤即可新增填寫。</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map(guest => {
            const record = guest.postEventRecord!;
            return (
              <div
                key={guest.id}
                onClick={() => onOpenGuestDetail(guest)}
                className="p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Guest info & arrival status */}
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {guest.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {record.actualArrivalStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {guest.company} · {guest.profession}
                    </p>

                    {/* Engagement Stars */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= record.engagementScore
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-2xs font-mono font-bold text-slate-600">
                        {record.engagementScore} / 5 分
                      </span>
                    </div>

                    <div className="mt-2 text-2xs text-slate-400">
                      紀錄者：{record.recordedBy} · {new Date(record.updatedAt).toLocaleDateString('zh-TW')}
                    </div>
                  </div>

                  {/* Right Column: Observation & Brand Value */}
                  <div className="w-full md:w-2/3 space-y-2.5 text-xs">
                    {/* On-site observation */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>現場交流觀察：</span>
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {record.onSiteObservations}
                      </p>
                    </div>

                    {/* Brand Value Outcome - Key Focus */}
                    <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200/80">
                      <span className="font-semibold text-emerald-900 block mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>這些互動留下的品牌價值：</span>
                      </span>
                      <p className="text-emerald-950 font-medium leading-relaxed">
                        {record.brandValueOutcome}
                      </p>
                    </div>

                    {/* Follow-up actions */}
                    <div className="flex items-center gap-2 text-2xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700 shrink-0">後續追蹤行動：</span>
                      <span className="text-slate-600 truncate">{record.followUpActions}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
