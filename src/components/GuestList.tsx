import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  Building2, 
  Briefcase, 
  Sparkles, 
  Award, 
  ChevronRight, 
  ShieldCheck,
  Tag,
  Clock,
  FileText,
  UserCheck
} from 'lucide-react';
import { Guest, GuestCategory, GuestTagType, OrganizerActionStatus } from '../types';

interface GuestListProps {
  guests: Guest[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  onSelectGuest: (guest: Guest) => void;
  onUpdateGuestStatus: (guestId: string, status: OrganizerActionStatus) => void;
}

export const GuestList: React.FC<GuestListProps> = ({
  guests,
  selectedCategory,
  onSelectCategory,
  onSelectGuest,
  onUpdateGuestStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<'all' | GuestTagType>('all');
  const [hasInteractionFilter, setHasInteractionFilter] = useState<'all' | 'yes' | 'no'>('all');

  const categories: { label: string; value: GuestCategory | 'all'; count: number }[] = [
    { label: '全部名單', value: 'all', count: guests.length },
    { label: '高度契合', value: '高度契合', count: guests.filter(g => g.analysis.category === '高度契合').length },
    { label: '值得觀察', value: '值得觀察', count: guests.filter(g => g.analysis.category === '值得觀察').length },
    { label: '需要確認', value: '需要確認', count: guests.filter(g => g.analysis.category === '需要確認').length },
    { label: '不符合本次活動條件', value: '不符合本次活動條件', count: guests.filter(g => g.analysis.category === '不符合本次活動條件').length },
  ];

  // Filter logic
  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && guest.analysis.category !== selectedCategory) {
        return false;
      }

      // Guest Tag filter
      if (tagFilter !== 'all' && guest.guestType !== tagFilter) {
        return false;
      }

      // Brand interaction filter
      if (hasInteractionFilter === 'yes' && !guest.hasBrandInteraction) return false;
      if (hasInteractionFilter === 'no' && guest.hasBrandInteraction) return false;

      // Keyword search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = guest.name.toLowerCase().includes(term);
        const matchesCompany = guest.company.toLowerCase().includes(term);
        const matchesProfession = guest.profession.toLowerCase().includes(term);
        const matchesIndustry = guest.industry.toLowerCase().includes(term);
        const matchesPurpose = guest.attendancePurpose.toLowerCase().includes(term);
        const matchesNotes = (guest.notes || '').toLowerCase().includes(term);
        if (!matchesName && !matchesCompany && !matchesProfession && !matchesIndustry && !matchesPurpose && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [guests, selectedCategory, tagFilter, hasInteractionFilter, searchTerm]);

  // Badge helpers
  const getCategoryBadge = (category: GuestCategory) => {
    switch (category) {
      case '高度契合':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            高度契合
          </span>
        );
      case '值得觀察':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            值得觀察
          </span>
        );
      case '需要確認':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            需要確認
          </span>
        );
      case '不符合本次活動條件':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            不符條件
          </span>
        );
    }
  };

  const getGuestTypeTag = (type: GuestTagType) => {
    switch (type) {
      case 'vip':
        return <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">VIP 貴賓</span>;
      case 'partner':
        return <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">合作夥伴</span>;
      case 'media':
        return <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-cyan-100 text-cyan-800 border border-cyan-200">重要媒體</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-2xs font-medium bg-slate-100 text-slate-600">一般報名</span>;
    }
  };

  const getStatusBadge = (status: OrganizerActionStatus) => {
    switch (status) {
      case '已核准邀請':
        return <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">已核准</span>;
      case '安排 VIP 專屬接待':
        return <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">VIP 接待</span>;
      case '現場引薦觀察':
        return <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">現場觀察</span>;
      case '列入候補／委婉致意':
        return <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">候補/致意</span>;
      default:
        return <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">待審核</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Category Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 pt-3 flex overflow-x-auto scrollbar-none gap-2">
        {categories.map(tab => {
          const isActive = (selectedCategory === null && tab.value === 'all') || selectedCategory === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onSelectCategory(tab.value === 'all' ? null : tab.value)}
              className={`pb-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'border-blue-600 text-blue-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-2xs font-mono ${
                  isActive ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-guest-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="搜尋姓名、公司、職稱、動機或備註..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              清除
            </button>
          )}
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>身分標籤：</span>
          </div>
          <select
            id="select-tag-filter"
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value as any)}
            aria-label="來賓身分標籤篩選"
            className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">全體身份</option>
            <option value="vip">VIP 貴賓</option>
            <option value="partner">合作夥伴</option>
            <option value="media">重要媒體</option>
            <option value="general">一般參與者</option>
          </select>

          <div className="flex items-center gap-1 text-slate-500 font-medium ml-1">
            <span>品牌互動：</span>
          </div>
          <select
            id="select-interaction-filter"
            value={hasInteractionFilter}
            onChange={e => setHasInteractionFilter(e.target.value as any)}
            aria-label="品牌互動歷史篩選"
            className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="yes">曾有品牌互動</option>
            <option value="no">首次接觸</option>
          </select>

          {(searchTerm || tagFilter !== 'all' || hasInteractionFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTagFilter('all');
                setHasInteractionFilter('all');
              }}
              className="text-xs text-blue-600 hover:underline ml-auto"
            >
              重設篩選
            </button>
          )}
        </div>
      </div>

      {/* Guest List Body */}
      {filteredGuests.length === 0 ? (
        <div className="py-12 text-center">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">未找到符合條件的來賓資料</p>
          <p className="text-xs text-slate-400 mt-1">請嘗試變更搜尋關鍵字或調整篩選分類標籤</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredGuests.map(guest => {
            const hasVerificationNeeded = guest.analysis.humanVerificationItems.length > 0;
            const hasAnomalies = guest.analysis.anomalyAlerts.length > 0;
            const hasPostEvent = Boolean(guest.postEventRecord);

            return (
              <div
                key={guest.id}
                id={`guest-item-${guest.id}`}
                onClick={() => onSelectGuest(guest)}
                className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  {/* Left info: Guest credentials */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {guest.name}
                      </h3>
                      {getGuestTypeTag(guest.guestType)}
                      {guest.hasBrandInteraction && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-2xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <UserCheck className="w-3 h-3" />
                          曾有品牌互動
                        </span>
                      )}
                      {getStatusBadge(guest.organizerStatus)}
                      {hasPostEvent && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-2xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <FileText className="w-3 h-3" />
                          現場觀察已登錄
                        </span>
                      )}
                    </div>

                    {/* Company & Title */}
                    <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {guest.company}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {guest.profession}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{guest.industry}</span>
                    </div>

                    {/* Purpose preview */}
                    <p className="mt-2 text-xs text-slate-600 line-clamp-1">
                      <span className="font-semibold text-slate-700">參加目的：</span>
                      {guest.attendancePurpose}
                    </p>

                    {/* Alert notice pills if any */}
                    {(hasVerificationNeeded || hasAnomalies) && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                        {hasAnomalies && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-2xs font-medium">
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            {guest.analysis.anomalyAlerts[0]}
                          </span>
                        )}
                        {hasVerificationNeeded && !hasAnomalies && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-2xs font-medium">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            需人工確認：{guest.analysis.humanVerificationItems[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right info: AI Assessment & Scores */}
                  <div className="flex sm:items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="flex items-center lg:justify-end gap-2">
                        {getCategoryBadge(guest.analysis.category)}
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {guest.analysis.fitScore}分
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">合作潛力：</span>
                        <span className="text-slate-600">{guest.analysis.brandSynergyPotential}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                      <span className="text-xs font-medium hidden sm:inline mr-1">檢視完整檔案</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer count summary & AI disclaimer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          共顯示 <span className="font-semibold text-slate-800">{filteredGuests.length}</span> 位來賓（資料即時同步）
        </div>
        <div className="flex items-center gap-1 text-2xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>全數分析均為輔助參考，不使用歧視性判定，由主辦方落實人工複審。</span>
        </div>
      </div>
    </div>
  );
};
