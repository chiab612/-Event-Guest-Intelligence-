export type GuestCategory = 
  | '高度契合' 
  | '值得觀察' 
  | '需要確認' 
  | '不符合本次活動條件';

export type PastHistoryType = 
  | '初次參加' 
  | '曾出席同類論壇' 
  | '曾報名未出席 (No-Show 紀錄)' 
  | '品牌社群活躍成員' 
  | '既有企業客戶／簽約夥伴';

export type GuestTagType = 'general' | 'vip' | 'partner' | 'media';

export type OrganizerActionStatus = 
  | '待審核'
  | '已核准邀請'
  | '安排 VIP 專屬接待'
  | '現場引薦觀察'
  | '列入候補／委婉致意';

export interface PostEventRecord {
  attended: boolean;
  actualArrivalStatus: '準時出席' | '遲到' | '未出席' | '派代表出席';
  engagementScore: number; // 1-5
  onSiteObservations: string; // 現場觀察紀錄
  brandValueOutcome: string; // 互動留下的價值
  followUpActions: string; // 活動後續追蹤建議
  recordedBy: string;
  updatedAt: string;
}

export interface AIAnalysisResult {
  category: GuestCategory;
  fitScore: number; // 0 - 100
  fitAssessment: string; // 活動契合度分析
  brandSynergyPotential: '極高合作價值' | '潛在商務機會' | '具社群傳播力' | '中等交流價值' | '需進一步探索' | '無明顯互補效益';
  brandSynergyDetails: string; // 品牌合作潛力深入說明
  humanVerificationItems: string[]; // 需要人工確認項目
  recommendedObservations: string[]; // 建議觀察重點
  anomalyAlerts: string[]; // 重複／異常資料提示
  analyzedAt: string;
  isAiGenerated: boolean;
}

export interface Guest {
  id: string;
  name: string; // 姓名／暱稱
  company: string; // 任職機構／公司
  profession: string; // 職業／職稱
  industry: string; // 產業
  professionalBackground: string; // 專業背景
  attendancePurpose: string; // 參加活動目的
  pastAttendanceHistory: PastHistoryType; // 過往參與紀錄
  hasBrandInteraction: boolean; // 是否曾與品牌互動
  brandInteractionDetails?: string; // 品牌互動歷史詳情
  guestType: GuestTagType; // 是否為 VIP／合作夥伴／媒體
  notes?: string; // 備註
  email?: string;
  createdAt: string;
  
  // AI 輔助分析
  analysis: AIAnalysisResult;
  
  // 主辦方管理決策
  organizerStatus: OrganizerActionStatus;
  organizerInternalNotes?: string;
  
  // 活動後回饋與觀察紀錄
  postEventRecord?: PostEventRecord;
}

export interface EventMetadata {
  id: string;
  name: string;
  theme: string;
  date: string;
  location: string;
  targetAudience: string;
  objective: string;
  maxCapacity: number;
}
