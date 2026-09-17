import React from 'react';
import { X, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Users, Compass } from 'lucide-react';

interface BrandPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandPhilosophyModal: React.FC<BrandPhilosophyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const pillars = [
    {
      num: '01',
      title: '來賓是否符合活動目的',
      desc: '依據活動主題與設定目標受眾，客觀檢視報名者背景，避免名額錯置或體驗期待落差。',
    },
    {
      num: '02',
      title: '是否可能與主題產生正向連結',
      desc: '發掘具備技術互補、產業資源或策略對接價值的潛力夥伴，協助品牌創造跨界協同。',
    },
    {
      num: '03',
      title: '辨識重複報名與待確認項目',
      desc: '自動提醒同機構重複登記、資訊缺漏或身份模糊情況，讓主辦方能有效分配有限席位。',
    },
    {
      num: '04',
      title: '留意品牌形象與體驗風險',
      desc: '及早提示單向強迫推銷、競業個資索取等潛在風險，防範現場干擾，守護優質活動體驗。',
    },
    {
      num: '05',
      title: '堅持以人工做最終審核決定',
      desc: 'AI 僅提供多維度輔助分析；不涉個人道德定性或歧視指標，關鍵決策始終由主辦方落實。',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xs font-mono uppercase tracking-widest text-blue-400">
                  EVENT OPTIMIZER PHILOSOPHY
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  活動優化師的核心定位與初衷
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="關閉對話框"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* Main Statement Quote */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-xl border border-slate-800 relative">
            <div className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wider">
              品牌定位的核心誓言
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              「活動優化師，不只是幫品牌把人邀進來，而是協助品牌理解：誰進來、為什麼來，以及這些互動會留下什麼價值。」
            </p>
          </div>

          <div>
            <p className="text-slate-600 leading-relaxed">
              這不是單純的報名表，也不是用 AI 判斷一個人「好或壞」。我們深信每一場高品質商務活動，都是品牌與產業生態建立信任的寶貴場域。
            </p>
          </div>

          {/* 5 Core Pillars */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              活動優化師的 5 項核心辨識準則：
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {pillars.map(p => (
                <div key={p.num} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {p.num}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{p.title}</h4>
                    <p className="text-2xs text-slate-600 mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ethics guarantee */}
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start gap-2.5 text-2xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              本系統嚴格禁止任何歧視性、政治、種族或敏感個人隱私作為衡量指標。所有 AI 生成之數值與建議均標註為「輔助分析」，確保審查機制既專業透明，又兼具人性溫度與品牌尊嚴。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            瞭解並返回系統
          </button>
        </div>
      </div>
    </div>
  );
};
