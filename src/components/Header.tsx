import React from 'react';
import { ScreenTab } from '../types';
import { playPop } from '../utils/audio';

interface HeaderProps {
  currentTab: ScreenTab;
  setCurrentTab: (tab: ScreenTab) => void;
  sfxEnabled: boolean;
  setSfxEnabled: (val: boolean) => void;
  classroomMode: boolean;
  setClassroomMode: (val: boolean) => void;
  userAvatar: string;
  onAvatarClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  sfxEnabled,
  setSfxEnabled,
  classroomMode,
  setClassroomMode,
  userAvatar,
  onAvatarClick
}) => {
  const handleTabClick = (tab: ScreenTab) => {
    playPop(sfxEnabled);
    setCurrentTab(tab);
  };

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    if (next) {
      playPop(true);
    }
  };

  const toggleClassroom = () => {
    playPop(sfxEnabled);
    setClassroomMode(!classroomMode);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fffdfa]/95 backdrop-blur-md border-b-2 border-amber-200/90 shadow-sm transition-all">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <button
          onClick={() => handleTabClick('games-hub')}
          className="flex items-center gap-3 shrink-0 text-left focus:outline-none group"
        >
          <div className="w-12 h-12 rounded-2xl p-1 bg-amber-100/80 border-2 border-amber-300 flex items-center justify-center shadow-sm -rotate-2 group-hover:rotate-0 transition-transform">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1VizX0BpRYTcHG_mEPO7sHzJigjV2-AcR-QTLXqjIGi4xZhtgnJSaOIkyb-Ii2iagW3Y3KK0bOOCg1hcXXkxqHhEGeC-lF627effTolUNdn4GDCq3AReseSbeX1h4Xb6hUnZ0D7yNzkheJsYyeLpzHwPKcIRL2Jx6a7dMVXXjTrx0u7GbWXVmqmSEBpMtRlmqi-GqpzNsmAQHPl10eSqzJK_WyCjVoqfIZ55OjbmbWQ1JOyjXgA2neemr8"
              alt="MathVenture Logo"
              className="h-10 w-10 object-contain rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-rubik text-lg sm:text-xl text-[#7d5800] font-black tracking-tight leading-none group-hover:text-amber-600 transition-colors">
                MathVenture Kids
              </span>
              <span className="text-amber-500 text-sm">✨</span>
            </div>
            <span className="font-jakarta text-[11px] text-[#b32057] font-extrabold tracking-wider uppercase">
              Candy Math Playground
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-amber-50/70 rounded-full border border-amber-200/80 shadow-inner">
          <button
            onClick={() => handleTabClick('games-hub')}
            className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all duration-150 ${
              currentTab === 'games-hub'
                ? 'bg-[#ffb703] text-[#6b4b00] border-2 border-amber-400 shadow-[0_3px_0_#d97706]'
                : 'text-stone-700 hover:bg-amber-100 hover:text-stone-900'
            }`}
          >
            🎮 Games Hub
          </button>

          <button
            onClick={() => handleTabClick('guess-my-number')}
            className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all duration-150 ${
              currentTab === 'guess-my-number'
                ? 'bg-purple-500 text-white border-2 border-purple-600 shadow-[0_3px_0_#7e22ce]'
                : 'text-stone-700 hover:bg-purple-50 hover:text-purple-900'
            }`}
          >
            🔍 Guess My Number
          </button>

          <button
            onClick={() => handleTabClick('card-duel')}
            className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all duration-150 ${
              currentTab === 'card-duel'
                ? 'bg-sky-500 text-white border-2 border-sky-600 shadow-[0_3px_0_#0284c7]'
                : 'text-stone-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            ⚡ Card Duel
          </button>

          <button
            onClick={() => handleTabClick('race-to-100')}
            className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all duration-150 ${
              currentTab === 'race-to-100'
                ? 'bg-orange-500 text-white border-2 border-orange-600 shadow-[0_3px_0_#c2410c]'
                : 'text-stone-700 hover:bg-orange-50 hover:text-orange-900'
            }`}
          >
            🎲 Race to 100
          </button>

          <button
            onClick={() => handleTabClick('two-player-lobby')}
            className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all duration-150 ${
              currentTab === 'two-player-lobby'
                ? 'bg-[#2563eb] text-white border-2 border-blue-600 shadow-[0_3px_0_#1d4ed8]'
                : 'text-stone-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            👥 2-Player Party
          </button>

          <button
            onClick={() => handleTabClick('guide')}
            className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all duration-150 ${
              currentTab === 'guide'
                ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-[0_3px_0_#047857]'
                : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-900'
            }`}
          >
            📘 Guide
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* SFX Toggle */}
          <button
            onClick={toggleSfx}
            className={`h-10 px-3 rounded-full border-2 flex items-center gap-1.5 transition-all bubbly-button ${
              sfxEnabled
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-stone-100 border-stone-300 text-stone-400'
            }`}
            title={sfxEnabled ? 'Sound Effects: Enabled' : 'Sound Effects: Muted'}
            type="button"
          >
            <span className="text-base">{sfxEnabled ? '🔔' : '🔕'}</span>
            <span className="hidden sm:inline font-jakarta text-xs font-bold">
              {sfxEnabled ? 'SFX On' : 'SFX Off'}
            </span>
          </button>

          {/* Classroom Mode Toggle */}
          <button
            onClick={toggleClassroom}
            className={`h-10 px-3 rounded-full border-2 flex items-center gap-1.5 transition-all bubbly-button ${
              classroomMode
                ? 'bg-purple-100 border-purple-400 text-purple-900 ring-2 ring-purple-300'
                : 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
            }`}
            title="Classroom / Big Screen Presentation Mode"
            type="button"
          >
            <span className="text-base">🏫</span>
            <span className="hidden sm:inline font-jakarta text-xs font-bold">
              {classroomMode ? 'Classroom: Active' : 'Classroom'}
            </span>
          </button>

          {/* Character Profile Avatar */}
          <button
            onClick={onAvatarClick}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 p-0.5 shadow-md flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform"
            title="Switch Player Avatar"
            type="button"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xl shadow-inner">
              {userAvatar}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 bg-amber-50/90 border-t border-amber-200/60 gap-1.5 scrollbar-none">
        <button
          onClick={() => handleTabClick('games-hub')}
          className={`px-3 py-1 rounded-full font-jakarta text-xs font-extrabold whitespace-nowrap ${
            currentTab === 'games-hub' ? 'bg-[#ffb703] text-[#6b4b00] shadow-sm' : 'text-stone-700'
          }`}
        >
          🎮 Hub
        </button>
        <button
          onClick={() => handleTabClick('guess-my-number')}
          className={`px-3 py-1 rounded-full font-jakarta text-xs font-extrabold whitespace-nowrap ${
            currentTab === 'guess-my-number' ? 'bg-purple-500 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          🔍 Guess Number
        </button>
        <button
          onClick={() => handleTabClick('card-duel')}
          className={`px-3 py-1 rounded-full font-jakarta text-xs font-extrabold whitespace-nowrap ${
            currentTab === 'card-duel' ? 'bg-sky-500 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          ⚡ Card Duel
        </button>
        <button
          onClick={() => handleTabClick('race-to-100')}
          className={`px-3 py-1 rounded-full font-jakarta text-xs font-extrabold whitespace-nowrap ${
            currentTab === 'race-to-100' ? 'bg-orange-500 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          🎲 Race to 100
        </button>
        <button
          onClick={() => handleTabClick('two-player-lobby')}
          className={`px-3 py-1 rounded-full font-jakarta text-xs font-extrabold whitespace-nowrap ${
            currentTab === 'two-player-lobby' ? 'bg-blue-600 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          👥 2-Player
        </button>
        <button
          onClick={() => handleTabClick('guide')}
          className={`px-3 py-1 rounded-full font-jakarta text-xs font-extrabold whitespace-nowrap ${
            currentTab === 'guide' ? 'bg-emerald-500 text-white shadow-sm' : 'text-stone-700'
          }`}
        >
          📘 Guide
        </button>
      </div>
    </header>
  );
};
