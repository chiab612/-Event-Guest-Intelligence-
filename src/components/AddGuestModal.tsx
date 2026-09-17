import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Shield, 
  Building2, 
  Briefcase, 
  User, 
  Tag, 
  History, 
  MessageSquare, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Send,
  Wand2
} from 'lucide-react';
import { Guest, GuestTagType, PastHistoryType, EventMetadata } from '../types';
import { analyzeGuestWithAI } from '../services/analyzer';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (newGuest: Guest) => void;
  existingGuests: Guest[];
  eventContext: EventMetadata;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  onAddGuest,
  existingGuests,
  eventContext,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [profession, setProfession] = useState('');
  const [industry, setIndustry] = useState('科技與軟體服務');
  const [professionalBackground, setProfessionalBackground] = useState('');
  const [attendancePurpose, setAttendancePurpose] = useState('');
  const [pastAttendanceHistory, setPastAttendanceHistory] = useState<PastHistoryType>('初次參加');
  const [hasBrandInteraction, setHasBrandInteraction] = useState(false);
  const [brandInteractionDetails, setBrandInteractionDetails] = useState('');
  const [guestType, setGuestType] = useState<GuestTagType>('general');
  const [notes, setNotes] = useState('');
  const [email, setEmail] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Preset scenarios for instant testing
  const loadPreset = (type: 'high_fit' | 'worth_obs' | 'sales_risk' | 'mismatch') => {
    setErrorMsg('');
    if (type === 'high_fit') {
      setName('郭怡文');
      setCompany('聯華智能製造控股');
      setProfession('智慧工廠與永續營運部 協理');
      setIndustry('先進製造與半導體供應鏈');
      setProfessionalBackground('12 年智慧製造經驗，主導工廠能耗大數據監控與 ISO 50001 能源管理系統導入。');
      setAttendancePurpose('尋找能結合 AI 即時優化產線能耗之雲端方案，並了解標竿企業碳盤查數位化實務。');
      setPastAttendanceHistory('曾出席同類論壇');
      setHasBrandInteraction(true);
      setBrandInteractionDetails('曾於去年智慧製造展參觀我方攤位，對數據分析引擎表達高度導入意向。');
      setGuestType('vip');
      setNotes('希望與我方技術架構師換名片交流。');
      setEmail('yw.kuo@united-smartfab.com');
    } else if (type === 'worth_obs') {
      setName('許庭瑋');
      setCompany('綠脈生醫科技');
      setProfession('技術長兼資深研發副總');
      setIndustry('生技醫療');
      setProfessionalBackground('前工研院研究員，專長生物降解材料與生醫冷鏈碳足跡演算法開發。');
      setAttendancePurpose('觀察生技業在綠色轉型法規下的衝擊，評估與科技平台進行技術整合。');
      setPastAttendanceHistory('初次參加');
      setHasBrandInteraction(false);
      setBrandInteractionDetails('');
      setGuestType('partner');
      setNotes('由天使投資人推薦報名。');
      setEmail('tw.hsu@greenpulse-bio.com');
    } else if (type === 'sales_risk') {
      setName('李宗翰');
      setCompany('全贏通訊硬體經銷');
      setProfession('資深業務代表');
      setIndustry('通訊硬體經銷');
      setProfessionalBackground('從事機房網路設備銷售 3 年。');
      setAttendancePurpose('來看看大家都在聊什麼，順便認識各公司採購經理，推銷我們的伺服器機櫃與散熱模組。');
      setPastAttendanceHistory('初次參加');
      setHasBrandInteraction(false);
      setBrandInteractionDetails('');
      setGuestType('general');
      setNotes('希望能提供與會來賓聯絡通訊錄。');
      setEmail('sales.li@win-win-telecom.com');
    } else if (type === 'mismatch') {
      setName('柯佩珊');
      setCompany('自由文字接案 / 大學兼任助教');
      setProfession('藝文自由接案者');
      setIndustry('文化與文字創作');
      setProfessionalBackground('文字工作者，專門撰寫文創展覽評論。');
      setAttendancePurpose('想找靈感，順便看看有沒有公關稿或文案外包合作機會。');
      setPastAttendanceHistory('初次參加');
      setHasBrandInteraction(false);
      setBrandInteractionDetails('');
      setGuestType('general');
      setNotes('無');
      setEmail('peishan.ke@creative-free.tw');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('請填寫來賓姓名／暱稱');
      return;
    }
    if (!profession.trim()) {
      setErrorMsg('請填寫來賓職業／職稱');
      return;
    }
    if (!attendancePurpose.trim()) {
      setErrorMsg('請填寫參加活動目的');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      const guestData = {
        name: name.trim(),
        company: company.trim() || '個人參與／未註明',
        profession: profession.trim(),
        industry,
        professionalBackground: professionalBackground.trim(),
        attendancePurpose: attendancePurpose.trim(),
        pastAttendanceHistory,
        hasBrandInteraction,
        brandInteractionDetails: brandInteractionDetails.trim(),
        guestType,
        notes: notes.trim(),
        email: email.trim(),
      };

      // Call AI Analysis
      const analysis = await analyzeGuestWithAI(guestData, existingGuests, eventContext);

      const newGuest: Guest = {
        id: `guest-${Date.now()}`,
        ...guestData,
        createdAt: new Date().toISOString(),
        analysis,
        organizerStatus: analysis.category === '高度契合' && guestType === 'vip' 
          ? '安排 VIP 專屬接待' 
          : analysis.category === '高度契合' 
          ? '已核准邀請' 
          : analysis.category === '不符合本次活動條件'
          ? '列入候補／委婉致意'
          : '待審核',
        organizerInternalNotes: analysis.anomalyAlerts.length > 0 
          ? `系統標註：${analysis.anomalyAlerts[0]}` 
          : '',
      };

      onAddGuest(newGuest);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('分析過程發生問題，請稍候重試。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:px-6 sm:py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                新增來賓並啟動 AI 輔助分析
              </h2>
              <p className="text-2xs sm:text-xs text-slate-400">
                錄入來賓公開資料，由活動優化師引擎客觀辨識契合度與潛在商務連結
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉表單"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick presets bar for convenience */}
        <div className="bg-slate-100/80 px-4 sm:px-6 py-2 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            快速載入範例：
          </span>
          <button
            type="button"
            onClick={() => loadPreset('high_fit')}
            className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 rounded text-slate-700 hover:text-emerald-800 transition-colors text-2xs font-medium"
          >
            綠能高階主管 (高度契合)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('worth_obs')}
            className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded text-slate-700 hover:text-indigo-800 transition-colors text-2xs font-medium"
          >
            生醫技術長 (值得觀察)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('sales_risk')}
            className="px-2 py-1 bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-400 rounded text-slate-700 hover:text-amber-800 transition-colors text-2xs font-medium"
          >
            硬體推銷業務 (需要確認)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('mismatch')}
            className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700 transition-colors text-2xs font-medium"
          >
            文創求職者 (不符閉門條件)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                姓名／暱稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例如：林書涵"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                任職公司／機構名稱
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="例如：宏達綠能科技集團"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Row 2: Profession & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                職業／職稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profession}
                onChange={e => setProfession(e.target.value)}
                placeholder="例如：副總裁兼永續長 (CSO)"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                所屬產業
              </label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
              >
                <option value="能源與綠色科技">能源與綠色科技</option>
                <option value="科技與軟體服務">科技與軟體服務</option>
                <option value="人工智慧與物聯網">人工智慧與物聯網</option>
                <option value="先進製造與半導體">先進製造與半導體</option>
                <option value="金融與永續投資">金融與永續投資</option>
                <option value="財經與科技媒體">財經與科技媒體</option>
                <option value="生技醫療">生技醫療</option>
                <option value="企管顧問">企管顧問</option>
                <option value="文化創意/其他">文化創意/其他</option>
              </select>
            </div>
          </div>

          {/* Row 3: Professional Background */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              專業背景與實務經歷
            </label>
            <textarea
              rows={2}
              value={professionalBackground}
              onChange={e => setProfessionalBackground(e.target.value)}
              placeholder="例如：主導多年智慧能源監控，具備碳盤查與供應鏈永續推廣實務..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Row 4: Attendance Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              參加活動目的 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={attendancePurpose}
              onChange={e => setAttendancePurpose(e.target.value)}
              placeholder="說明為何報名此活動、期望獲得何種資訊或尋找何種合作夥伴..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Row 5: Past history & Guest type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                過往參與紀錄
              </label>
              <select
                value={pastAttendanceHistory}
                onChange={e => setPastAttendanceHistory(e.target.value as PastHistoryType)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
              >
                <option value="初次參加">初次參加</option>
                <option value="曾出席同類論壇">曾出席同類論壇</option>
                <option value="曾報名未出席 (No-Show 紀錄)">曾報名未出席 (No-Show 紀錄)</option>
                <option value="品牌社群活躍成員">品牌社群活躍成員</option>
                <option value="既有企業客戶／簽約夥伴">既有企業客戶／簽約夥伴</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                是否為 VIP／合作夥伴／媒體
              </label>
              <select
                value={guestType}
                onChange={e => setGuestType(e.target.value as GuestTagType)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
              >
                <option value="general">一般專業參與者</option>
                <option value="vip">VIP 貴賓</option>
                <option value="partner">合作夥伴</option>
                <option value="media">重要媒體代表</option>
              </select>
            </div>
          </div>

          {/* Row 6: Brand Interaction Checkbox & details */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBrandInteraction}
                onChange={e => setHasBrandInteraction(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                曾與主辦品牌互動或接觸過
              </span>
            </label>

            {hasBrandInteraction && (
              <div className="mt-2 pl-6">
                <input
                  type="text"
                  value={brandInteractionDetails}
                  onChange={e => setBrandInteractionDetails(e.target.value)}
                  placeholder="說明過去互動場景（例如：曾合作 POC、曾參與前屆年會...）"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Row 7: Notes & Contact Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                電子信箱 (用於重複性檢核)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@company.com"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                備註事項
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="例如：需預留專屬席位、同行助理等..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Ethics reminder notice */}
          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 flex items-start gap-2 text-2xs text-slate-600 leading-relaxed">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-950 font-semibold">活動優化師倫理宣告：</strong>
              <span>
                系統不以歧視性、人格定性或非公開敏感個資作為評判標準；AI 輔助分析聚焦於活動主題相符性與主辦方價值創造，最終審核與邀請決定權在主辦方。
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors"
            >
              取消
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all disabled:opacity-70"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI 多維度分析評估中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>執行 AI 輔助分析並建檔</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
