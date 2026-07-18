import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import useVocabulary from '../../vocabulary/hooks/useVocabulary';
import useVocabularyFilters from '../../vocabulary/hooks/useVocabularyFilters';
import FilterBar from '../../vocabulary/components/FilterBar';
import VocabularyGallery from '../../vocabulary/components/VocabularyGallery';
import VocabularyDetailDrawer from '../../vocabulary/components/VocabularyDetailDrawer';
import TopBar from '../../../shared/components/TopBar';
import Button from '../../../shared/components/ui/Button';
import ModeSelector from '../components/ModeSelector';
import '../../home/pages/HomePage.css'; // Reuse sidebar layout styles

function XpBar({ xp, level }) {
  const xpForNext = level * 100;
  const pct = Math.min((xp / xpForNext) * 100, 100);
  return (
    <div className="xp-bar-wrap">
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="xp-label">{xp} / {xpForNext} XP</span>
    </div>
  );
}

export default function StudyHubPage() {
  const navigate = useNavigate();
  const { currentUser, logout, childProfile } = useAuthStore();
  const childId = childProfile?.id;
  const user = currentUser || {};

  // Fetch enriched vocabulary with image mapping and learning status
  const { data: vocabData, loading, error } = useVocabulary(childId);

  // Filters hook
  const {
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredData,
    stats,
  } = useVocabularyFilters(vocabData);

  // Detail Drawer state
  const [selectedVocab, setSelectedVocab] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('flashcards');

  // Compute category word counts from enriched vocabulary list
  const categoryCounts = useMemo(() => {
    const map = new Map();
    vocabData.forEach((v) => {
      if (v.categoryId) {
        map.set(v.categoryId, (map.get(v.categoryId) || 0) + 1);
      }
    });
    return map;
  }, [vocabData]);

  // Active category object helper
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategory) || null;
  }, [categories, selectedCategory]);

  const handleStartSession = () => {
    if (!selectedCategory) {
      alert("Vui lòng chọn một chủ đề trước khi bắt đầu học!");
      return;
    }
    if (!selectedMode) return;
    navigate(`/study/${selectedCategory}/${selectedMode}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCardClick = (vocab) => {
    setSelectedVocab(vocab);
    setDrawerOpen(true);
  };

  return (
    <div className="home-root app-shell">
      <div className="noise-overlay" aria-hidden="true" />
      
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🦉</span>
          <span className="brand-name">BuddyEnglish</span>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">{user.nickname?.[0]?.toUpperCase() || '?'}</div>
          <div className="profile-info">
            <p className="profile-name">{user.nickname || 'Learner'}</p>
            <p className="profile-level">Level {user.level ?? 1} Explorer</p>
          </div>
        </div>

        <XpBar xp={user.xp ?? 0} level={user.level ?? 1} />

        <div className="stats-grid">
          <div className="stat-chip">
            <span className="stat-icon">🪙</span>
            <span className="stat-val">{user.coins ?? 0}</span>
            <span className="stat-lbl">Coins</span>
          </div>
          <div className="stat-chip">
            <span className="stat-icon">⭐</span>
            <span className="stat-val">{user.xp ?? 0}</span>
            <span className="stat-lbl">XP</span>
          </div>
          <div className="stat-chip">
            <span className="stat-icon">🔥</span>
            <span className="stat-val">{user.streakDays ?? 0}</span>
            <span className="stat-lbl">Streak</span>
          </div>
          <div className="stat-chip">
            <span className="stat-icon">🏆</span>
            <span className="stat-val">Lv{user.level ?? 1}</span>
            <span className="stat-lbl">Level</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="/home" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/home') }}>
            <span>💬</span> Chat with Buddy
          </a>
          <a href="/study" className="nav-item active" onClick={(e) => { e.preventDefault() }}>
            <span>📖</span> Study Modes
          </a>
          <a href="/adventure" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/adventure') }}>
            <span>🗺️</span> Adventures
          </a>
          <a href="/character-creator" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/character-creator') }}>
            <span>🎨</span> Create Character
          </a>
          <a href="/notifications" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/notifications') }}>
            <span>🔔</span> Notifications
          </a>
        </nav>

        <Button variant="secondary" className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> Logout
        </Button>
      </aside>

      {/* ── Main content workspace ── */}
      <main className="chat-main" style={{ overflowY: 'auto', paddingBottom: '40px' }}>
        <TopBar theme="dark" />

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
          <div>
            <h1 className="font-grotesk text-3xl font-bold text-cream mb-2 flex items-center gap-3">
              🧠 Study Modes Hub
            </h1>
            <p className="text-sm text-cream/60 max-w-xl">
              Chọn chủ đề từ vựng bạn muốn ôn tập, xem trước ảnh & nghĩa từ vựng, rồi chọn chế độ học tương ứng để bắt đầu.
            </p>
          </div>

          {/* 📂 Topic Selection */}
          {!loading && categories.length > 0 && (
            <div>
              <h2 className="font-grotesk text-xl font-bold text-cream mb-4 flex items-center gap-2">
                📂 1. Chọn chủ đề học
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const wordCount = categoryCounts.get(cat.id) || 0;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all select-none ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-cream shadow-glow'
                          : 'bg-slate-900/40 border-slate-800 text-cream/70 hover:border-slate-700 hover:text-cream'
                      }`}
                    >
                      <h4 className="font-grotesk font-bold text-base mb-1 truncate">
                        {cat.name}
                      </h4>
                      <p className="font-mono text-xs text-cream/40">
                        {wordCount} từ vựng
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 🎮 Mode selection */}
          <div>
            <h2 className="font-grotesk text-xl font-bold text-cream mb-4 flex items-center gap-2">
              🎮 2. Chọn chế độ ôn tập
            </h2>
            <ModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />
          </div>

          {/* Start Button */}
          <div className="flex flex-col items-center pt-2">
            <button
              onClick={handleStartSession}
              disabled={!selectedCategory}
              className="px-12 py-4 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-800 disabled:to-slate-900 disabled:text-cream/35 disabled:cursor-not-allowed disabled:shadow-none text-white font-grotesk font-bold text-lg shadow-glow hover:scale-[1.03] active:scale-[0.97] transition-all w-full max-w-md"
            >
              🚀 Bắt đầu ôn tập {activeCategory ? `"${activeCategory.name}"` : ''}
            </button>
            {!selectedCategory && (
              <p className="text-xs text-danger font-mono uppercase tracking-wider mt-2">
                * Vui lòng chọn một chủ đề ở Bước 1 trước!
              </p>
            )}
          </div>

          {/* 📖 Vocabulary Preview Section */}
          <div className="border-t border-slate-800/80 pt-10">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-grotesk text-2xl font-bold text-cream flex items-center gap-2">
                  📚 Bộ từ vựng của bạn
                </h2>
                <p className="text-sm text-cream/50 mt-1">
                  Hiển thị hình ảnh thực tế và nghĩa dịch đầy đủ của các từ bạn đã học.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              stats={stats}
            />

            {/* Vocabulary cards gallery */}
            <div className="mt-6">
              <VocabularyGallery
                items={filteredData}
                loading={loading}
                error={error}
                onCardClick={handleCardClick}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Vocabulary Detail Drawer */}
      <VocabularyDetailDrawer
        vocab={selectedVocab}
        childId={childId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
