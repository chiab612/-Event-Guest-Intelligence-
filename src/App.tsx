import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Calendar, 
  MapPin, 
  Layers, 
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Guest, EventMetadata, OrganizerActionStatus, PostEventRecord } from './types';
import { INITIAL_DEMO_GUESTS, DEFAULT_EVENT } from './data/demoGuests';
import { Header } from './components/Header';
import { DashboardMetrics } from './components/DashboardMetrics';
import { GuestList } from './components/GuestList';
import { GuestDetailModal } from './components/GuestDetailModal';
import { AddGuestModal } from './components/AddGuestModal';
import { PostEventObservationSection } from './components/PostEventObservationSection';
import { BrandPhilosophyModal } from './components/BrandPhilosophyModal';

export default function App() {
  const [event, setEvent] = useState<EventMetadata>(DEFAULT_EVENT);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_DEMO_GUESTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPhilosophyModalOpen, setIsPhilosophyModalOpen] = useState<boolean>(false);
  const [mainViewTab, setMainViewTab] = useState<'guests' | 'postEvent'>('guests');

  // Handle adding new guest
  const handleAddGuest = (newGuest: Guest) => {
    setGuests(prev => [newGuest, ...prev]);
    // Auto open newly added guest to see AI analysis immediately
    setSelectedGuest(newGuest);
  };

  // Handle updating organizer action status & internal notes
  const handleUpdateGuestStatus = (
    guestId: string, 
    status: OrganizerActionStatus, 
    internalNotes?: string
  ) => {
    setGuests(prev =>
      prev.map(g => {
        if (g.id === guestId) {
          return {
            ...g,
            organizerStatus: status,
            organizerInternalNotes: internalNotes !== undefined ? internalNotes : g.organizerInternalNotes,
          };
        }
        return g;
      })
    );
    // Also update selectedGuest if open
    if (selectedGuest && selectedGuest.id === guestId) {
      setSelectedGuest(prev =>
        prev
          ? {
              ...prev,
              organizerStatus: status,
              organizerInternalNotes: internalNotes !== undefined ? internalNotes : prev.organizerInternalNotes,
            }
          : null
      );
    }
  };

  // Handle saving post-event observation record
  const handleSavePostEventRecord = (guestId: string, record: PostEventRecord) => {
    setGuests(prev =>
      prev.map(g => {
        if (g.id === guestId) {
          return {
            ...g,
            postEventRecord: record,
          };
        }
        return g;
      })
    );
    if (selectedGuest && selectedGuest.id === guestId) {
      setSelectedGuest(prev => (prev ? { ...prev, postEventRecord: record } : null));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans">
      {/* Global Top Header */}
      <Header
        event={event}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenPhilosophyModal={() => setIsPhilosophyModalOpen(true)}
        guestCount={guests.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Event Intelligence Dashboard Section */}
        <DashboardMetrics
          guests={guests}
          event={event}
          selectedCategory={selectedCategory}
          onSelectCategoryFilter={cat => setSelectedCategory(cat)}
        />

        {/* View Switcher: Guest Intelligence vs Post-Event Records */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-200 sm:border-b-0 pb-2 sm:pb-0">
            <button
              id="view-tab-guests"
              onClick={() => setMainViewTab('guests')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mainViewTab === 'guests'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>來賓名單與 AI 輔助分析</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-2xs font-mono ${
                  mainViewTab === 'guests' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {guests.length}
              </span>
            </button>

            <button
              id="view-tab-post-event"
              onClick={() => setMainViewTab('postEvent')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mainViewTab === 'postEvent'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>活動後回饋與現場觀察紀錄</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-2xs font-mono ${
                  mainViewTab === 'postEvent' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {guests.filter(g => Boolean(g.postEventRecord)).length}
              </span>
            </button>
          </div>

          <div className="text-2xs text-slate-500 flex items-center gap-1.5 self-end sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>系統狀態：即時輔助分析引擎運作中 · 支援一鍵新增測試</span>
          </div>
        </div>

        {/* View Switcher Content */}
        {mainViewTab === 'guests' ? (
          <GuestList
            guests={guests}
            selectedCategory={selectedCategory}
            onSelectCategory={cat => setSelectedCategory(cat)}
            onSelectGuest={guest => setSelectedGuest(guest)}
            onUpdateGuestStatus={handleUpdateGuestStatus}
          />
        ) : (
          <PostEventObservationSection
            guests={guests}
            onOpenGuestDetail={guest => setSelectedGuest(guest)}
          />
        )}

        {/* Brand Core Positioning Banner (as requested) */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4" />
              <span>活動優化師 核心價值定位</span>
            </div>
            <blockquote className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-relaxed">
              「活動優化師，不只是幫品牌把人邀進來，而是協助品牌理解：誰進來、為什麼來，以及這些互動會留下什麼價值。」
            </blockquote>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              跳脫傳統點名表與冰冷的演算法篩選。我們從公開專業資料與活動目標對齊出發，精準發掘潛在合作夥伴、主動防範現場風險，並將每一次來賓互動轉化為品牌的長期信任資產。
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Event Guest Intelligence</span>
            <span>· 活動來賓品牌風險與價值分析器</span>
          </div>
          <div className="flex items-center gap-4 text-2xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              遵循嚴謹倫理規範：非定性個人評判，僅供主辦方輔助決策
            </span>
            <button
              onClick={() => setIsPhilosophyModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              檢視優化師初衷
            </button>
          </div>
        </div>
      </footer>

      {/* Guest Detail Dossier Modal */}
      {selectedGuest && (
        <GuestDetailModal
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
          onUpdateGuestStatus={handleUpdateGuestStatus}
          onSavePostEventRecord={handleSavePostEventRecord}
        />
      )}

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGuest={handleAddGuest}
        existingGuests={guests}
        eventContext={event}
      />

      {/* Brand Philosophy Modal */}
      <BrandPhilosophyModal
        isOpen={isPhilosophyModalOpen}
        onClose={() => setIsPhilosophyModalOpen(false)}
      />
    </div>
  );
}
