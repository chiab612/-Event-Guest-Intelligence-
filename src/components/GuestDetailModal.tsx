import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  User, 
  Tag, 
  History, 
  MessageSquare, 
  Calendar, 
  Star, 
  FileText, 
  Save, 
  Send,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Guest, OrganizerActionStatus, PostEventRecord } from '../types';

interface GuestDetailModalProps {
  guest: Guest | null;
  onClose: () => void;
  onUpdateGuestStatus: (guestId: string, status: OrganizerActionStatus, internalNotes?: string) => void;
  onSavePostEventRecord: (guestId: string, record: PostEventRecord) => void;
}

export const GuestDetailModal: React.FC<GuestDetailModalProps> = ({
  guest,
  onClose,
  onUpdateGuestStatus,
  onSavePostEventRecord,
}) => {
  if (!guest) return null;

  // Local state for organizer status & notes
  const [currentStatus, setCurrentStatus] = useState<OrganizerActionStatus>(guest.organizerStatus);
  const [internalNotes, setInternalNotes] = useState(guest.organizerInternalNotes || '');
  const [isSavedStatus, setIsSavedStatus] = useState(false);

  // Local state for post-event record
  const [activeTab, setActiveTab] = useState<'profile' | 'postEvent'>('profile');
  const [attended, setAttended] = useState(guest.postEventRecord?.attended ?? true);
  const [arrivalStatus, setArrivalStatus] = useState<PostEventRecord['actualArrivalStatus']>(
    guest.postEventRecord?.actualArrivalStatus || '準時出席'
  );
  const [engagementScore, setEngagementScore] = useState<number>(guest.postEventRecord?.engagementScore || 5);
  const [onSiteObservations, setOnSiteObservations] = useState(guest.postEventRecord?.onSiteObservations || '');
  const [brandValueOutcome, setBrandValueOutcome] = useState(guest.postEventRecord?.brandValueOutcome || '');
  const [followUpActions, setFollowUpActions] = useState(guest.postEventRecord?.followUpActions || '');
  const [recordedBy, setRecordedBy] = useState(guest.postEventRecord?.recordedBy || '活動優化師');
  const [isSavedPostEvent, setIsSavedPostEvent] = useState(false);

  const handleSaveDecision = () => {
    onUpdateGuestStatus(guest.id, currentStatus, internalNotes);
    setIsSavedStatus(true);
    setTimeout(() => setIsSavedStatus(false), 2000);
  };

  const handleSavePostEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PostEventRecord = {
      attended,
      actualArrivalStatus: arrivalStatus,
      engagementScore,
      onSiteObservations: onSiteObservations.trim() || '與會互動良好，對議程主題展現濃厚興趣。',
      brandValueOutcome: brandValueOutcome.trim() || '建立了高階商務互信，確認雙方潛在合作場景。',
      followUpActions: followUpActions.trim() || '會後 48 小時內寄送論壇簡報與專案資料。',
      recordedBy: recordedBy.trim() || '活動優化師',
      updatedAt: new Date().toISOString(),
    };
    onSavePostEventRecord(guest.id, newRecord);
    setIsSavedPostEvent(true);
    setTimeout(() => setIsSavedPostEvent(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:px-6 sm:py-5 flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                來賓檔案編號 #{guest.id}
              </span>
              {guest.guestType === 'vip' && (
                <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  VIP 貴賓
                </span>
              )}
              {guest.guestType === 'partner' && (
                <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  合作夥伴
                </span>
              )}
              {guest.guestType === 'media' && (
                <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  重要媒體
                </span>
              )}
              {guest.hasBrandInteraction && (
                <span className="px-2 py-0.5 rounded text-2xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  曾有品牌互動
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {guest.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {guest.company} · {guest.profession}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="關閉來賓詳細檔案"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-700 bg-white -mb-px rounded-t-lg border-t border-x'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>AI 輔助分析與報名資料</span>
          </button>

          <button
            onClick={() => setActiveTab('postEvent')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'postEvent'
                ? 'border-blue-600 text-blue-700 bg-white -mb-px rounded-t-lg border-t border-x'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>活動後回饋與觀察紀錄</span>
            {guest.postEventRecord && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'profile' ? (
            <>
              {/* Section 1: AI Analysis Showcase */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        活動優化師 AI 輔助分析報告
                      </h3>
                      <span className="text-2xs text-slate-400">
                        依據公開資料與活動主軸綜合評估 · 非定罪評判
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-2xs text-slate-400 block">活動契合度評分</span>
                      <span className="font-mono text-xl font-bold text-blue-400">
                        {guest.analysis.fitScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white">
                      分類：{guest.analysis.category}
                    </div>
                  </div>
                </div>

                {/* Analysis Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                  {/* Fit Assessment */}
                  <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                    <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>活動契合度解析</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {guest.analysis.fitAssessment}
                    </p>
                  </div>

                  {/* Brand Synergy Potential */}
                  <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                    <div className="text-slate-400 font-semibold mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>品牌合作潛力</span>
                      </span>
                      <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {guest.analysis.brandSynergyPotential}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {guest.analysis.brandSynergyDetails}
                    </p>
                  </div>
                </div>

                {/* Needs Human Verification Checklist */}
                {guest.analysis.humanVerificationItems.length > 0 && (
                  <div className="mt-3.5 bg-amber-950/40 border border-amber-800/50 p-3.5 rounded-lg">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>需要人工確認項目（主辦方待複核）</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
                      {guest.analysis.humanVerificationItems.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Duplicate / Anomaly Alerts */}
                {guest.analysis.anomalyAlerts.length > 0 && (
                  <div className="mt-3 bg-rose-950/40 border border-rose-800/50 p-3.5 rounded-lg">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs mb-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>重複／異常資料提示</span>
                    </div>
                    <ul className="space-y-1 text-xs text-rose-200/90 list-disc list-inside">
                      {guest.analysis.anomalyAlerts.map((alert, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Observations */}
                {guest.analysis.recommendedObservations.length > 0 && (
                  <div className="mt-3 bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg">
                    <div className="flex items-center gap-1.5 text-blue-300 font-semibold text-xs mb-1.5">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>建議現場觀察重點與互動對接</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                      {guest.analysis.recommendedObservations.map((obs, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer Footnote */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-2xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    AI 輔助分析，不涉個人好壞定性，最終由主辦團隊負責
                  </span>
                  <span>分析時間：{new Date(guest.analysis.analyzedAt).toLocaleString('zh-TW')}</span>
                </div>
              </div>

              {/* Section 2: Full Guest Application Details */}
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-600" />
                  <span>來賓報名完整資料欄位</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">職業／職稱</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{guest.profession}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">任職公司／組織</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{guest.company}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">所屬產業</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{guest.industry}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">過往參與紀錄</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{guest.pastAttendanceHistory}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-medium block">專業背景說明</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                      {guest.professionalBackground || '未填寫'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-medium block">參加活動目的</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                      {guest.attendancePurpose || '未填寫'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">曾與品牌互動</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      {guest.hasBrandInteraction ? '是 (曾有接觸)' : '否 (首次接觸)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">身份類別</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block uppercase">
                      {guest.guestType}
                    </span>
                  </div>

                  {guest.brandInteractionDetails && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 font-medium block">品牌互動歷史詳情</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                        {guest.brandInteractionDetails}
                      </p>
                    </div>
                  )}

                  {guest.notes && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 font-medium block">備註說明</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                        {guest.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Organizer Decision Console */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-slate-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>主辦方人工審核決策控制台</span>
                  </h3>
                  {isSavedStatus && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-4 h-4" />
                      決策已儲存！
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      調整邀請／接待狀態
                    </label>
                    <select
                      value={currentStatus}
                      onChange={e => setCurrentStatus(e.target.value as OrganizerActionStatus)}
                      aria-label="調整邀請／接待狀態"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="待審核">待審核</option>
                      <option value="已核准邀請">已核准邀請</option>
                      <option value="安排 VIP 專屬接待">安排 VIP 專屬接待</option>
                      <option value="現場引薦觀察">現場引薦觀察</option>
                      <option value="列入候補／委婉致意">列入候補／委婉致意</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      主辦方內部備註筆記
                    </label>
                    <input
                      type="text"
                      value={internalNotes}
                      onChange={e => setInternalNotes(e.target.value)}
                      placeholder="例如：已電話確認出席意願、安排桌次等..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleSaveDecision}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>儲存主辦方決策</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Post-Event Observation & Value Form */
            <form onSubmit={handleSavePostEvent} className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 leading-relaxed">
                <p className="font-semibold flex items-center gap-1.5 text-blue-950">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>活動優化師核心精髓：「這些互動會留下什麼價值」</span>
                </p>
                <p className="mt-1 text-slate-600">
                  活動不是結束就沒事了。將現場實體觀察、來賓回饋與具體商務/品牌價值留存，是活動優化師建立長期關係資本的關鍵一哩路。
                </p>
              </div>

              {/* Status and Attendance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">實際出席狀況</label>
                  <select
                    value={arrivalStatus}
                    onChange={e => setArrivalStatus(e.target.value as any)}
                    aria-label="實際出席狀況"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                  >
                    <option value="準時出席">準時出席</option>
                    <option value="遲到">遲到參與</option>
                    <option value="派代表出席">派代理人出席</option>
                    <option value="未出席">未出席 (No-Show)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">現場互動參與深度 (1 - 5 星)</label>
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-300">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setEngagementScore(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= engagementScore ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 font-mono text-xs font-bold text-slate-700">{engagementScore} 星評價</span>
                  </div>
                </div>
              </div>

              {/* On-site observation text */}
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1">
                  現場交流觀察紀錄 (On-site Observations)
                </label>
                <textarea
                  rows={3}
                  value={onSiteObservations}
                  onChange={e => setOnSiteObservations(e.target.value)}
                  placeholder="紀錄來賓在現場發言、茶歇交流對象、關注的主題議題..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Brand Value Outcome */}
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1">
                  互動留下的品牌價值 (Brand Value Outcome)
                </label>
                <textarea
                  rows={3}
                  value={brandValueOutcome}
                  onChange={e => setBrandValueOutcome(e.target.value)}
                  placeholder="例如：確認下一階段 POC 合作、達成聯合專題報導協議、引薦指標客戶..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Follow-up actions */}
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1">
                  會後追蹤執行建議 (Follow-up Actions)
                </label>
                <input
                  type="text"
                  value={followUpActions}
                  onChange={e => setFollowUpActions(e.target.value)}
                  placeholder="例如：會後 48 小時內發送白皮書，預約下週二拜訪..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>紀錄人員：</span>
                  <input
                    type="text"
                    value={recordedBy}
                    onChange={e => setRecordedBy(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-0.5 text-xs w-28"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavedPostEvent ? '儲存成功！' : '儲存活動觀察紀錄'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-2xs text-slate-500">
            目前狀態：<strong className="text-slate-800">{currentStatus}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
