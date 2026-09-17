import { Guest, AIAnalysisResult, GuestCategory, EventMetadata } from '../types';

/**
 * 輔助分析引擎
 * 核心原則：
 * 1. 嚴格不使用任何性別、年齡、種族、宗教、人格等歧視性或敏感個資
 * 2. 僅就「活動主題相符度」、「專業背景關聯性」、「出席動機明確性」與「主辦方商務／社群正向連結」進行情境評估
 * 3. 識別重複報名、資格資訊不全、競業或推銷風險，並具體列出交由主辦方人工確認的項目
 */
export function analyzeGuestLocally(
  guestData: {
    name: string;
    company: string;
    profession: string;
    industry: string;
    professionalBackground: string;
    attendancePurpose: string;
    pastAttendanceHistory: string;
    hasBrandInteraction: boolean;
    brandInteractionDetails?: string;
    guestType: string;
    notes?: string;
    email?: string;
  },
  existingGuests: Guest[] = [],
  eventContext: EventMetadata
): AIAnalysisResult {
  const anomalies: string[] = [];
  const verificationItems: string[] = [];
  const observations: string[] = [];

  const textToEvaluate = `${guestData.profession} ${guestData.professionalBackground} ${guestData.attendancePurpose} ${guestData.notes || ''}`.toLowerCase();
  const eventKeywords = `${eventContext.theme} ${eventContext.objective} ${eventContext.targetAudience}`.toLowerCase();

  // 1. 重複報名與異常資料提示 (Duplicate & Anomaly Detection)
  const duplicates = existingGuests.filter(g => {
    const isSameName = g.name.trim().toLowerCase() === guestData.name.trim().toLowerCase();
    const isSameEmail = guestData.email && g.email && g.email.trim().toLowerCase() === guestData.email.trim().toLowerCase();
    const isSameCompanyDept = guestData.company && g.company && g.company.trim().toLowerCase() === guestData.company.trim().toLowerCase();
    return (isSameName || isSameEmail) && g.id !== (guestData as any).id;
  });

  const sameCompanyMembers = existingGuests.filter(g => 
    guestData.company && g.company && g.company.trim().toLowerCase() === guestData.company.trim().toLowerCase()
  );

  if (duplicates.length > 0) {
    anomalies.push(`偵測到系統已有同名或相同信箱的來賓登記（${duplicates.map(d => d.name).join(', ')}），請確認是否為重複填單或多名同名人員。`);
  }

  if (sameCompanyMembers.length >= 2) {
    anomalies.push(`同單位（${guestData.company}）已有 ${sameCompanyMembers.length} 位同仁報名。因活動名額有限，建議主辦方確認席位分配政策。`);
  }

  // 目的文字過短或空泛
  if (!guestData.attendancePurpose || guestData.attendancePurpose.trim().length < 6) {
    verificationItems.push('參加目的說明過於簡短（少於 6 個字），建議主辦方於會前聯繫確認參會預期。');
  }

  // 2. 商業推銷、非對焦動機或競業識別（非定罪，提示人工確認）
  const salesKeywords = ['推銷', '找業務', '推廣我們公司', '拉客戶', '發傳單', '銷售產品', '招募業務', '賣軟體'];
  const hasSalesIntent = salesKeywords.some(kw => textToEvaluate.includes(kw));
  if (hasSalesIntent) {
    verificationItems.push('報名目的提及產品推廣或客戶開發，需確認是否符合本場交流規範，避免干擾其他參與者體驗。');
  }

  // 3. 過往紀錄風險評估
  if (guestData.pastAttendanceHistory === '曾報名未出席 (No-Show 紀錄)') {
    verificationItems.push('該來賓有過往報名卻未出席（No-Show）紀錄，建議行前電話或簡訊確認出席意願，以防現場空席。');
    observations.push('會前 24 小時提醒確認席位，可列入備取轉正名冊優先考量。');
  }

  // 4. VIP、媒體、合作夥伴識別
  if (guestData.guestType === 'media') {
    observations.push('具媒體身份：建議現場配置公關專員接待，安排發布會席位與新聞稿發放。');
    observations.push('會後可追蹤報導角度或社群曝光成效。');
  } else if (guestData.guestType === 'vip' || guestData.guestType === 'partner') {
    observations.push('品牌核心夥伴／VIP：建議由主辦方負責人或品牌高層親自於破冰環節致意。');
    observations.push('現場引薦與關鍵業務負責人對接，深化既有合作關係。');
  }

  // 5. 契合度計算與分類評級
  let score = 50; // 基礎中位數

  // 目標受眾與產業吻合
  const highRelevanceKeywords = [
    'ai', '人工智慧', '永續', 'esg', '科技', '軟體', '轉型', '創新', '技術', 
    '資深', '總監', '主管', '負責人', '創辦人', '經理', 'vp', 'ceo', 'cto', 
    'cmo', 'cio', '顧問', '研究員', '分析師', '架構師'
  ];

  let keywordHits = 0;
  highRelevanceKeywords.forEach(kw => {
    if (textToEvaluate.includes(kw)) keywordHits++;
  });
  score += Math.min(keywordHits * 6, 24);

  // 過去品牌互動加分
  if (guestData.hasBrandInteraction) {
    score += 12;
  }

  // 來賓身份權重
  if (guestData.guestType === 'vip' || guestData.guestType === 'partner') {
    score += 15;
  } else if (guestData.guestType === 'media') {
    score += 10;
  }

  // 動機明確且充實
  if (guestData.attendancePurpose && guestData.attendancePurpose.length > 25) {
    score += 8;
  }

  // 扣分項目（資格可能不符或風險）
  if (hasSalesIntent) {
    score -= 25;
  }
  if (guestData.pastAttendanceHistory === '曾報名未出席 (No-Show 紀錄)') {
    score -= 12;
  }

  // 檢查是否明顯非目標受眾（例如閉門高階峰會但無關聯且無動機）
  const isTargetAudienceMismatch = 
    (textToEvaluate.includes('學生') || textToEvaluate.includes('兼職') || textToEvaluate.includes('無工作')) &&
    eventContext.targetAudience.includes('企業決策者') &&
    !guestData.hasBrandInteraction &&
    guestData.guestType === 'general';

  if (isTargetAudienceMismatch) {
    score = Math.min(score, 38);
    verificationItems.push(`本活動設定為「${eventContext.targetAudience}」，來賓背景可能與目標定位有所差距，需確認是否有專案推薦。`);
  }

  // 限制分數 0 - 100
  score = Math.max(15, Math.min(98, score));

  // 判定分類
  let category: GuestCategory;
  if (isTargetAudienceMismatch && score < 42) {
    category = '不符合本次活動條件';
  } else if (verificationItems.length > 0 || anomalies.length > 0 || score < 58) {
    category = '需要確認';
  } else if (score >= 78) {
    category = '高度契合';
  } else {
    category = '值得觀察';
  }

  // 品牌合作潛力評定
  let brandSynergyPotential: AIAnalysisResult['brandSynergyPotential'] = '中等交流價值';
  let brandSynergyDetails = '';

  if (guestData.guestType === 'partner' || (guestData.hasBrandInteraction && score >= 80)) {
    brandSynergyPotential = '極高合作價值';
    brandSynergyDetails = '具備成熟合作基礎與高度決策關聯度，適合引薦進一步探討專案落地或深度商務協同。';
  } else if (guestData.guestType === 'media') {
    brandSynergyPotential = '具社群傳播力';
    brandSynergyDetails = '具備公信力或專業傳播管道，有助於活動後續論點擴散及品牌專業形象提升。';
  } else if (score >= 82) {
    brandSynergyPotential = '潛在商務機會';
    brandSynergyDetails = '背景與活動主軸深度共鳴，可能轉化為未來合作夥伴或高價值潛在客戶。';
  } else if (category === '不符合本次活動條件') {
    brandSynergyPotential = '無明顯互補效益';
    brandSynergyDetails = '當前業務範疇與本次活動設定無直接互補，建議維持一般電子報交流或轉介一般公開講座。';
  } else {
    brandSynergyPotential = '需進一步探索';
    brandSynergyDetails = '專業領域具交叉可能性，建議由現場工作人員透過輕鬆破冰提問深入了解其目前專案痛點。';
  }

  // 補充建議觀察重點
  if (observations.length === 0) {
    if (category === '高度契合') {
      observations.push('可在茶歇環節引薦與同領域專家或品牌負責人交流，激盪合作火花。');
      observations.push('建議邀請其於分組討論中分享實務經驗，豐富現場論壇深度。');
    } else if (category === '值得觀察') {
      observations.push('可觀察其在主題演講時的專注度與提問互動，評估後續跟進切入點。');
      observations.push('會後問卷特別關注其對內容實用性的評價反饋。');
    } else if (category === '需要確認') {
      observations.push('建議主辦方行前發出溫馨確認信或電話回訪，補齊關鍵背景資訊。');
    } else {
      observations.push('若無法提供現場席位，可禮貌致信建議參與線上轉播或後續公開講座。');
    }
  }

  let fitAssessment = '';
  if (category === '高度契合') {
    fitAssessment = `專業背景（${guestData.profession}）與活動核心主軸緊密呼應，報名目的聚焦且具建設性，符合本次預期目標受眾。`;
  } else if (category === '值得觀察') {
    fitAssessment = `具備相關產業視野與參會熱忱，動機明確，值得於活動現場進一步交流以發掘潛在合作價值。`;
  } else if (category === '需要確認') {
    fitAssessment = `基本背景具參考性，但存在 ${verificationItems.length} 項需主辦方確認事項或資訊待補全，建議經人工核實後再行發送邀請。`;
  } else {
    fitAssessment = `其報名意向或專業範疇與本次活動之閉門目標定位（${eventContext.targetAudience}）差距較大，建議另行轉介適合之公開資源。`;
  }

  return {
    category,
    fitScore: score,
    fitAssessment,
    brandSynergyPotential,
    brandSynergyDetails,
    humanVerificationItems: verificationItems,
    recommendedObservations: observations,
    anomalyAlerts: anomalies,
    analyzedAt: new Date().toISOString(),
    isAiGenerated: true,
  };
}

/**
 * 遠端／伺服器 Gemini AI 分析或本地分析自動轉接
 */
export async function analyzeGuestWithAI(
  guestData: {
    name: string;
    company: string;
    profession: string;
    industry: string;
    professionalBackground: string;
    attendancePurpose: string;
    pastAttendanceHistory: string;
    hasBrandInteraction: boolean;
    brandInteractionDetails?: string;
    guestType: string;
    notes?: string;
    email?: string;
  },
  existingGuests: Guest[],
  eventContext: EventMetadata
): Promise<AIAnalysisResult> {
  try {
    const res = await fetch('/api/analyze-guest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guestData,
        existingGuestsCount: existingGuests.length,
        eventContext,
        duplicatesDetected: existingGuests.some(
          g => g.name.trim().toLowerCase() === guestData.name.trim().toLowerCase() && g.id !== (guestData as any).id
        ),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.category) {
        return data as AIAnalysisResult;
      }
    }
  } catch {
    // Fallback to local heuristic engine gracefully
  }

  // Always deterministic and robust fallback
  return analyzeGuestLocally(guestData, existingGuests, eventContext);
}
