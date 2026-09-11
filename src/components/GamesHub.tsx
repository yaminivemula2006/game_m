import React, { useState } from 'react';
import { ScreenTab, AgeTier, SupplyType } from '../types';
import { playPop, playSuccess } from '../utils/audio';

interface GamesHubProps {
  onNavigate: (tab: ScreenTab) => void;
  sfxEnabled: boolean;
  onOpenCheatSheet: () => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  onNavigate,
  sfxEnabled,
  onOpenCheatSheet
}) => {
  const [ageFilter, setAgeFilter] = useState<AgeTier>('all');
  const [supplyFilter, setSupplyFilter] = useState<SupplyType>('all');
  const [cardMode, setCardMode] = useState<'addition' | 'multiplication' | 'target'>('addition');
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  
  // Game Assistant Modal
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantGameTitle, setAssistantGameTitle] = useState('Guess My Number');
  const [assistantTurnCount, setAssistantTurnCount] = useState(1);

  const prompts = [
    '“Is it greater than 25?”',
    '“Is it an even number?”',
    '“Is the tens digit 3?”',
    '“Can you count by 5s to hit it?”'
  ];

  const nextPrompt = () => {
    playPop(sfxEnabled);
    setCurrentPromptIdx((prev) => (prev + 1) % prompts.length);
  };

  const prevPrompt = () => {
    playPop(sfxEnabled);
    setCurrentPromptIdx((prev) => (prev - 1 + prompts.length) % prompts.length);
  };

  const handleLaunchAssistant = (title: string) => {
    playSuccess(sfxEnabled);
    setAssistantGameTitle(title);
    setAssistantTurnCount(1);
    setIsAssistantOpen(true);
  };

  // Card filter matching
  const matchesFilter = (gameAge: ('young' | 'mid' | 'upper')[], gameSupply: 'none' | 'cards' | 'dice') => {
    const ageOk = ageFilter === 'all' || gameAge.includes(ageFilter as 'young' | 'mid' | 'upper');
    const supplyOk = supplyFilter === 'all' || supplyFilter === gameSupply;
    return ageOk && supplyOk;
  };

  const showGuess = matchesFilter(['young', 'mid'], 'none');
  const showDuel = matchesFilter(['mid', 'upper'], 'cards');
  const showRace = matchesFilter(['mid', 'upper'], 'dice');

  return (
    <div className="flex flex-col w-full">
      {/* Hero Greeting & Interactive Filter Bar */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-gradient-to-r from-amber-100/90 via-rose-100/60 to-sky-100/80 border-2 border-amber-300/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Background Ambient Bubbles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-200/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute right-1/3 bottom-0 w-32 h-32 bg-pink-200/40 rounded-full blur-xl pointer-events-none"></div>

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-stone-800 font-jakarta font-black mb-3 border-2 border-amber-300 shadow-sm text-xs sm:text-sm">
              <span className="text-base">🚀</span>
              Hey Math Explorer! Welcome to MathVenture Kids!
              <span className="text-amber-500">✨</span>
            </div>
            <h1 className="font-rubik text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight font-black leading-tight">
              Physical Games, <span className="text-[#b32057] underline decoration-amber-400 decoration-wavy decoration-2">Playful Math</span> Mindsets!
            </h1>
            <p className="mt-3 font-jakarta text-sm sm:text-base lg:text-lg text-stone-600 font-medium leading-relaxed">
              Tactile, giggly, screen-free numeracy games for dinner tables, cozy rug circles, and classrooms. Pick by age or toys on hand to spark instant intuition! 🎈
            </p>
          </div>

          {/* Quick Active Playlist Badge */}
          <div className="flex items-center gap-3.5 bg-white/95 border-2 border-amber-300 px-5 py-3.5 rounded-3xl shadow-md shrink-0 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center shadow-md text-2xl rotate-3">
              🎪
            </div>
            <div>
              <div className="font-jakarta text-[11px] text-stone-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                <span>Active Playlist</span>
                <span className="text-amber-500">⭐</span>
              </div>
              <div className="font-rubik text-base sm:text-lg text-stone-900 font-extrabold flex items-center gap-1.5">
                3 Classic Adventures
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar Component */}
        <div className="mt-6 bg-[#fefbf6] border-2 border-amber-200/80 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Age Tiers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-jakarta text-xs sm:text-sm text-stone-700 mr-1 flex items-center gap-1 font-extrabold">
              <span className="text-base">🎒</span> Age Tier:
            </span>
            <button
              onClick={() => { playPop(sfxEnabled); setAgeFilter('all'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all bubbly-button ${
                ageFilter === 'all'
                  ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-amber-100 border-2 border-amber-200'
              }`}
            >
              All Explorers (4–12) 🌈
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setAgeFilter('young'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-bold transition-all bubbly-button ${
                ageFilter === 'young'
                  ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-amber-100 border-2 border-amber-200'
              }`}
            >
              Early Sprouts (4–6) 🌱
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setAgeFilter('mid'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-bold transition-all bubbly-button ${
                ageFilter === 'mid'
                  ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-amber-100 border-2 border-amber-200'
              }`}
            >
              Primary Navigators (7–9) ⛵
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setAgeFilter('upper'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-bold transition-all bubbly-button ${
                ageFilter === 'upper'
                  ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-amber-100 border-2 border-amber-200'
              }`}
            >
              Upper Masters (10–12) 🚀
            </button>
          </div>

          {/* Supplies Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-jakarta text-xs sm:text-sm text-stone-700 mr-1 flex items-center gap-1 font-extrabold">
              <span className="text-base">📦</span> Supplies:
            </span>
            <button
              onClick={() => { playPop(sfxEnabled); setSupplyFilter('all'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-extrabold transition-all bubbly-button ${
                supplyFilter === 'all'
                  ? 'bg-sky-500 text-white border-2 border-sky-600 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-sky-50 border-2 border-sky-200'
              }`}
            >
              Any Toys
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setSupplyFilter('none'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-bold transition-all bubbly-button ${
                supplyFilter === 'none'
                  ? 'bg-sky-500 text-white border-2 border-sky-600 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-sky-50 border-2 border-sky-200'
              }`}
            >
              Zero (Just Voices! 🗣️)
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setSupplyFilter('cards'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-bold transition-all bubbly-button ${
                supplyFilter === 'cards'
                  ? 'bg-sky-500 text-white border-2 border-sky-600 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-sky-50 border-2 border-sky-200'
              }`}
            >
              Card Deck 🃏
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setSupplyFilter('dice'); }}
              className={`px-3.5 py-1.5 rounded-full font-jakarta text-xs sm:text-sm font-bold transition-all bubbly-button ${
                supplyFilter === 'dice'
                  ? 'bg-sky-500 text-white border-2 border-sky-600 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-sky-50 border-2 border-sky-200'
              }`}
            >
              2 Dice 🎲
            </button>
          </div>
        </div>
      </section>

      {/* Main Game Activities: 3-Col Bubbly Bento Matrix */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* OPTION 1: Guess My Number */}
          {showGuess && (
            <article className="flex flex-col bg-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-3.5 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300"></div>
              
              <div className="flex items-start justify-between gap-4 mt-2">
                <div>
                  <span className="inline-flex items-center gap-1 font-jakarta text-[11px] tracking-wider uppercase text-purple-700 font-extrabold bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                    <span>🔍</span> Option 01 • Secret Detective
                  </span>
                  <h2 className="font-rubik text-2xl text-stone-900 font-black mt-2 flex items-center gap-2">
                    Guess My Number
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100 border-2 border-purple-300 font-jakarta text-xs text-purple-900 font-extrabold shrink-0 shadow-sm">
                  ⭐ Ages 4–10
                </span>
              </div>

              {/* Supply Badge */}
              <div className="flex items-center gap-2 mt-3 text-purple-900 bg-purple-50/70 px-3 py-1.5 rounded-xl border border-purple-100 font-jakarta text-xs">
                <span className="text-base">🗣️</span>
                <span><strong>Supplies:</strong> None / Purely Verbal &amp; Giggles</span>
              </div>

              {/* Curricular Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-jakarta text-xs font-bold">
                  🔍 Detective Deduction
                </span>
                <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-800 border border-pink-200 font-jakarta text-xs font-bold">
                  🔢 Place Value
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-jakarta text-xs font-bold">
                  ⚖️ Even / Odd Clues
                </span>
              </div>

              {/* Visual Showcase: Interactive Range Ladder */}
              <div className="mt-5 bg-gradient-to-b from-purple-50/70 to-pink-50/40 border-2 border-purple-100 rounded-3xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                  <span className="flex items-center gap-1">🎈 Secret Zone: 1 to 50</span>
                  <span className="text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">Binary Halving 🧩</span>
                </div>

                {/* SVG Number Ladder */}
                <div className="w-full bg-white rounded-2xl p-3 border-2 border-purple-100 shadow-inner">
                  <svg className="w-full h-14" fill="none" viewBox="0 0 340 56">
                    <rect fill="#ede9fe" height="10" rx="5" width="320" x="10" y="23"></rect>
                    <rect fill="#c084fc" fillOpacity="0.3" height="16" rx="8" width="140" x="95" y="20"></rect>
                    <rect fill="#9333ea" height="8" rx="4" width="140" x="95" y="24"></rect>
                    {/* Tick 1 */}
                    <circle cx="10" cy="28" fill="#a855f7" r="6"></circle>
                    <text fill="#6b21a8" fontFamily="Rubik" fontSize="11" fontWeight="800" textAnchor="middle" x="10" y="48">1</text>
                    {/* Clue A */}
                    <circle cx="95" cy="28" fill="#f43f5e" r="6"></circle>
                    <text fill="#be123c" fontFamily="Rubik" fontSize="10" fontWeight="800" textAnchor="middle" x="95" y="16">&gt;15 NO ❌</text>
                    {/* Mystery Star */}
                    <circle cx="165" cy="28" fill="#f59e0b" r="9"></circle>
                    <text fill="#ffffff" fontFamily="Rubik" fontSize="11" fontWeight="900" textAnchor="middle" x="165" y="32">?</text>
                    <text fill="#b45309" fontFamily="Rubik" fontSize="11" fontWeight="800" textAnchor="middle" x="165" y="49">Mystery ⭐</text>
                    {/* Clue B */}
                    <circle cx="235" cy="28" fill="#10b981" r="6"></circle>
                    <text fill="#047857" fontFamily="Rubik" fontSize="10" fontWeight="800" textAnchor="middle" x="235" y="16">&lt;35 YES ✔️</text>
                    {/* Tick 50 */}
                    <circle cx="330" cy="28" fill="#a855f7" r="6"></circle>
                    <text fill="#6b21a8" fontFamily="Rubik" fontSize="11" fontWeight="800" textAnchor="middle" x="330" y="48">50</text>
                  </svg>
                </div>

                {/* Prompt Carousel */}
                <div className="relative bg-white rounded-2xl p-3.5 border-2 border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-jakarta text-xs text-purple-700 font-extrabold flex items-center gap-1">
                      <span>💡</span> Detective Clue Cards
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={prevPrompt}
                        className="w-7 h-7 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center justify-center transition-colors bubbly-button text-sm font-bold"
                        type="button"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextPrompt}
                        className="w-7 h-7 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center justify-center transition-colors bubbly-button text-sm font-bold"
                        type="button"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                  <div className="font-rubik text-sm sm:text-base text-purple-950 py-1 min-h-[3rem] flex items-center font-bold">
                    {prompts[currentPromptIdx]}
                  </div>
                  <div className="flex justify-center gap-1.5 mt-2">
                    {prompts.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === currentPromptIdx ? 'bg-purple-600 scale-110' : 'bg-purple-200'
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 flex flex-col gap-3">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm text-lg">
                    🤖
                  </div>
                  <p className="font-jakarta text-xs text-purple-900 leading-snug">
                    <strong>Detective Rule:</strong> Secret Keeper can ONLY answer “Yes” or “No”! Keep track of clues!
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('guess-my-number')}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-jakarta font-extrabold flex items-center justify-center gap-2 border-2 border-purple-700 shadow-md bubbly-button"
                  type="button"
                >
                  <span className="text-xl">🕵️</span>
                  Ready, Set, Play Detective!
                </button>
              </div>
            </article>
          )}

          {/* OPTION 2: Make the Target • Duel */}
          {showDuel && (
            <article className="flex flex-col bg-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-sky-200 hover:border-sky-300 hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-3.5 bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300"></div>

              <div className="flex items-start justify-between gap-4 mt-2">
                <div>
                  <span className="inline-flex items-center gap-1 font-jakarta text-[11px] tracking-wider uppercase text-sky-700 font-extrabold bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                    <span>⚡</span> Option 02 • Card Arena
                  </span>
                  <h2 className="font-rubik text-2xl text-stone-900 font-black mt-2 flex items-center gap-2">
                    Make the Target • Duel
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-100 border-2 border-sky-300 font-jakarta text-xs text-sky-900 font-extrabold shrink-0 shadow-sm">
                  ⚡ Ages 5–12
                </span>
              </div>

              {/* Supply Badge */}
              <div className="flex items-center gap-2 mt-3 text-sky-900 bg-sky-50/70 px-3 py-1.5 rounded-xl border border-sky-100 font-jakarta text-xs">
                <span className="text-base">🃏</span>
                <span><strong>Supplies:</strong> 1 Card Deck (Face cards = 10 or Wild!)</span>
              </div>

              {/* Curricular Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-jakarta text-xs font-bold">
                  ➕ Mental Addition
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-jakarta text-xs font-bold">
                  ✖️ Times Table Blitz
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-jakarta text-xs font-bold">
                  🎯 Hit Target 20
                </span>
              </div>

              {/* Card Mode Tabs & Visual Fan */}
              <div className="mt-5 bg-gradient-to-b from-sky-50/70 to-teal-50/40 border-2 border-sky-100 rounded-3xl p-4 flex flex-col gap-4">
                <div className="flex p-1 bg-sky-100/70 rounded-2xl gap-1 border border-sky-200">
                  <button
                    onClick={() => { playPop(sfxEnabled); setCardMode('addition'); }}
                    className={`flex-1 py-1.5 rounded-xl text-center font-jakarta text-xs font-extrabold transition-all ${
                      cardMode === 'addition'
                        ? 'bg-white text-sky-700 shadow-sm border border-sky-200'
                        : 'text-sky-900 hover:text-sky-700'
                    }`}
                  >
                    ➕ Add Duel
                  </button>
                  <button
                    onClick={() => { playPop(sfxEnabled); setCardMode('multiplication'); }}
                    className={`flex-1 py-1.5 rounded-xl text-center font-jakarta text-xs font-extrabold transition-all ${
                      cardMode === 'multiplication'
                        ? 'bg-white text-sky-700 shadow-sm border border-sky-200'
                        : 'text-sky-900 hover:text-sky-700'
                    }`}
                  >
                    ✖️ Multi Blitz
                  </button>
                  <button
                    onClick={() => { playPop(sfxEnabled); setCardMode('target'); }}
                    className={`flex-1 py-1.5 rounded-xl text-center font-jakarta text-xs font-extrabold transition-all ${
                      cardMode === 'target'
                        ? 'bg-white text-sky-700 shadow-sm border border-sky-200'
                        : 'text-sky-900 hover:text-sky-700'
                    }`}
                  >
                    🎯 Target 20
                  </button>
                </div>

                {/* Tactile Cards Fan */}
                <div className="relative h-32 flex items-center justify-center overflow-hidden py-2 select-none">
                  {/* Card 1: 7 Diamonds */}
                  <div className="w-20 h-28 bg-white border-2 border-amber-300 rounded-2xl shadow-md flex flex-col justify-between p-2 transform -rotate-12 hover:rotate-0 transition-transform -mr-3 z-10">
                    <div className="flex flex-col items-start leading-none">
                      <span className="font-rubik text-sm text-amber-600 font-black">7</span>
                      <span className="text-amber-500 text-xs">♦</span>
                    </div>
                    <div className="text-center font-black text-amber-500 text-xl">♦</div>
                    <div className="flex flex-col items-end leading-none rotate-180">
                      <span className="font-rubik text-sm text-amber-600 font-black">7</span>
                    </div>
                  </div>

                  {/* Card 2: 8 Spades */}
                  <div className="w-20 h-28 bg-white border-2 border-sky-300 rounded-2xl shadow-xl flex flex-col justify-between p-2 transform rotate-2 hover:scale-105 transition-transform z-20">
                    <div className="flex flex-col items-start leading-none">
                      <span className="font-rubik text-sm text-sky-800 font-black">8</span>
                      <span className="text-sky-700 text-xs">♠</span>
                    </div>
                    <div className="text-center font-black text-sky-800 text-xl">♠</div>
                    <div className="flex flex-col items-end leading-none rotate-180">
                      <span className="font-rubik text-sm text-sky-800 font-black">8</span>
                    </div>
                  </div>

                  {/* Card 3: 5 Hearts */}
                  <div className="w-20 h-28 bg-white border-2 border-rose-300 rounded-2xl shadow-md flex flex-col justify-between p-2 transform rotate-14 hover:rotate-0 transition-transform -ml-3 z-10">
                    <div className="flex flex-col items-start leading-none">
                      <span className="font-rubik text-sm text-rose-500 font-black">5</span>
                      <span className="text-rose-500 text-xs">♥</span>
                    </div>
                    <div className="text-center font-black text-rose-500 text-xl">♥</div>
                    <div className="flex flex-col items-end leading-none rotate-180">
                      <span className="font-rubik text-sm text-rose-500 font-black">5</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Mode Explanation */}
                <div className="bg-white rounded-2xl p-3 border-2 border-sky-200 font-jakarta text-xs text-sky-950 flex items-center justify-between">
                  {cardMode === 'addition' && (
                    <>
                      <span><strong>Turn Over 2:</strong> Highest sum wins both cards!</span>
                      <span className="font-rubik text-xs text-sky-700 font-black bg-sky-100 px-2 py-0.5 rounded-lg">7 + 8 = 15 🏆</span>
                    </>
                  )}
                  {cardMode === 'multiplication' && (
                    <>
                      <span><strong>Turn Over 2:</strong> First to shout product wins pile!</span>
                      <span className="font-rubik text-xs text-sky-700 font-black bg-sky-100 px-2 py-0.5 rounded-lg">7 × 8 = 56 ⚡</span>
                    </>
                  )}
                  {cardMode === 'target' && (
                    <>
                      <span><strong>Deal 4 Cards:</strong> Use +, −, × to hit exactly 20!</span>
                      <span className="font-rubik text-xs text-rose-700 font-black bg-rose-100 px-2 py-0.5 rounded-lg">(8 − 5) + 7... 🎯</span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 flex flex-col gap-3">
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm text-lg">
                    🪄
                  </div>
                  <p className="font-jakarta text-xs text-sky-900 leading-snug">
                    <strong>Duel Tip:</strong> Aces = 1 point. King &amp; Queen are super power cards worth 10 each!
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('card-duel')}
                  className="w-full h-14 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-2xl font-jakarta font-extrabold flex items-center justify-center gap-2 border-2 border-sky-700 shadow-md bubbly-button"
                  type="button"
                >
                  <span className="text-xl">⚡</span>
                  Tap to Start Duel Adventure!
                </button>
              </div>
            </article>
          )}

          {/* OPTION 3: Race to 50 / Close to 100 */}
          {showRace && (
            <article className="flex flex-col bg-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-amber-200 hover:border-amber-300 hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-3.5 bg-gradient-to-r from-amber-400 via-rose-400 to-yellow-300"></div>

              <div className="flex items-start justify-between gap-4 mt-2">
                <div>
                  <span className="inline-flex items-center gap-1 font-jakarta text-[11px] tracking-wider uppercase text-amber-800 font-extrabold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <span>🎲</span> Option 03 • Strategy Race
                  </span>
                  <h2 className="font-rubik text-2xl text-stone-900 font-black mt-2 flex items-center gap-2">
                    Race to 50 • Close to 100
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 border-2 border-amber-300 font-jakarta text-xs text-amber-900 font-extrabold shrink-0 shadow-sm">
                  🚀 Ages 6–12
                </span>
              </div>

              {/* Supply Badge */}
              <div className="flex items-center gap-2 mt-3 text-amber-900 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-100 font-jakarta text-xs">
                <span className="text-base">🎲</span>
                <span><strong>Supplies:</strong> 2 Dice + Doodle Paper &amp; Pencil</span>
              </div>

              {/* Curricular Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-jakarta text-xs font-bold">
                  🧠 2-Digit Strategy
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-jakarta text-xs font-bold">
                  🎯 Estimation Radar
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 font-jakarta text-xs font-bold">
                  🚀 Double-Digit Adds
                </span>
              </div>

              {/* Visual 3D Dice Showcase */}
              <div className="mt-5 bg-gradient-to-b from-amber-50/70 to-yellow-50/50 border-2 border-amber-100 rounded-3xl p-4 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between border-2 border-amber-200 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    {/* Die 1: Coral Die */}
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl flex items-center justify-center font-rubik text-xl font-black shadow-[0_4px_0_#9f1239] border border-rose-300 -rotate-3">
                      3
                    </div>
                    <span className="font-rubik text-lg text-amber-600 font-black">&amp;</span>
                    {/* Die 2: Yellow Die */}
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 rounded-2xl flex items-center justify-center font-rubik text-xl font-black shadow-[0_4px_0_#b45309] border border-amber-300 rotate-3">
                      5
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-jakarta text-[11px] text-amber-800 uppercase block font-extrabold">You Decide:</span>
                    <div className="font-rubik text-base text-stone-900 font-black flex items-center gap-1.5 justify-end">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200 transition-colors">35</span>
                      <span className="text-xs text-amber-600">or</span>
                      <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-900 border border-rose-200 hover:bg-rose-200 transition-colors">53</span>
                    </div>
                  </div>
                </div>

                {/* Cumulative Round Tracker */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-amber-950 font-bold">
                    <span className="flex items-center gap-1">🚀 Rocket Trail to 100</span>
                    <span className="text-rose-600 font-extrabold">Target: 100 (Don't pop! 🎈)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-white border-2 border-amber-100 rounded-2xl text-center shadow-sm">
                      <div className="font-jakarta text-[11px] text-amber-800 font-bold">Turn 1</div>
                      <div className="font-rubik text-sm text-amber-900 font-black">+ 35</div>
                      <div className="text-[10px] text-amber-600 font-semibold">Sub: 35</div>
                    </div>
                    <div className="p-2 bg-white border-2 border-amber-200 rounded-2xl text-center shadow-sm">
                      <div className="font-jakarta text-[11px] text-amber-800 font-bold">Turn 2</div>
                      <div className="font-rubik text-sm text-amber-900 font-black">+ 42</div>
                      <div className="text-[10px] text-amber-600 font-semibold">Sub: 77</div>
                    </div>
                    <div className="p-2 bg-amber-200/80 border-2 border-amber-300 rounded-2xl text-center shadow-sm">
                      <div className="font-jakarta text-[11px] text-amber-900 font-extrabold">Turn 3</div>
                      <div className="font-rubik text-sm text-emerald-700 font-black">+ 18</div>
                      <div className="text-[10px] font-black text-emerald-800">Total: 95! 🎯</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-amber-100 h-3.5 rounded-full overflow-hidden mt-1 flex p-0.5 border border-amber-200">
                    <div className="bg-amber-500 h-full rounded-l-full" style={{ width: '35%' }}></div>
                    <div className="bg-rose-500 h-full" style={{ width: '42%' }}></div>
                    <div className="bg-emerald-500 h-full rounded-r-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 flex flex-col gap-3">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm text-lg">
                    💡
                  </div>
                  <p className="font-jakarta text-xs text-amber-900 leading-snug">
                    <strong>Clever Move:</strong> Pick big tens early (53!), then choose smaller units as you approach 100!
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('race-to-100')}
                  className="w-full h-14 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl font-jakarta font-extrabold flex items-center justify-center gap-2 border-2 border-amber-600 shadow-md bubbly-button"
                  type="button"
                >
                  <span className="text-xl">🎲</span>
                  Launch Dice Roller &amp; Board!
                </button>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* Classroom & Family Quick-Pick Highlight Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="relative bg-gradient-to-r from-amber-100/95 via-orange-50 to-pink-100/90 border-2 border-amber-300 rounded-3xl p-7 sm:p-9 overflow-hidden shadow-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 relative z-10 max-w-2xl">
            <div className="w-16 h-16 rounded-3xl bg-white border-2 border-amber-300 text-amber-500 flex items-center justify-center shadow-md shrink-0 text-3xl -rotate-3">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-300 text-amber-950 font-jakarta text-xs font-black shadow-sm">
                  ✨ Quick Family &amp; Classroom Pick
                </span>
                <span className="font-jakarta text-xs text-amber-900 font-bold">• 10-Minute Brain Spark ⚡</span>
              </div>
              <h3 className="font-rubik text-xl sm:text-2xl text-stone-900 font-black">
                Short on time? Play “Guess My Number” Right Now!
              </h3>
              <p className="font-jakarta text-sm sm:text-base text-stone-600 font-medium mt-1.5">
                Zero printing, zero setup, zero cleanup! Just huge smiles and high cognitive engagement during breakfast, car rides, or circle time.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('guess-my-number')}
              className="w-full sm:w-auto px-6 h-13 py-3 rounded-2xl bg-amber-500 text-white font-jakarta text-sm font-extrabold flex items-center justify-center gap-2 border-2 border-amber-600 shadow-md bubbly-button"
              type="button"
            >
              <span>⚡</span> Quick Start 1–50 Mode
            </button>
            <button
              onClick={onOpenCheatSheet}
              className="w-full sm:w-auto px-5 h-13 py-3 rounded-2xl bg-white text-stone-800 font-jakarta text-sm font-bold flex items-center justify-center gap-2 border-2 border-amber-200 hover:bg-amber-50 transition-colors shadow-sm bubbly-button"
              type="button"
            >
              <span>🖨️</span> Pocket Cheat-Sheet
            </button>
          </div>
        </div>
      </section>

      {/* Pedagogical Framework Section: Why Kids Love Playing Math! */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 mb-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-pink-900 border border-pink-200 font-jakarta text-xs font-black uppercase tracking-wider mb-2">
            <span>💖</span> Backed by Child Development Science
          </div>
          <h3 className="font-rubik text-2xl sm:text-3xl text-stone-900 font-black">
            Why Kids Love Playing Math! 🎈
          </h3>
          <p className="font-jakarta text-sm sm:text-base text-stone-600 mt-2 font-medium">
            Cognitive neuroscience confirms tactile manipulatives and friendly game stakes replace math anxiety with joyous discovery!
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mb-4 text-3xl shadow-sm">
              🧠
            </div>
            <h4 className="font-rubik text-lg text-stone-900 font-bold mb-2">Intuitive Number Sense</h4>
            <p className="font-jakarta text-xs sm:text-sm text-stone-600 leading-relaxed">
              Manipulating digits in <em>Race to 100</em> transforms dry symbols into physical spatial estimates children feel instinctively!
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-sky-200 shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center mb-4 text-3xl shadow-sm">
              💬
            </div>
            <h4 className="font-rubik text-lg text-stone-900 font-bold mb-2">Lively Mathematical Talk</h4>
            <p className="font-jakarta text-xs sm:text-sm text-stone-600 leading-relaxed">
              In <em>Guess My Number</em>, children construct real hypothesis inquiries (“Is it divisible by 5?”), boosting spoken confidence and reasoning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-rose-200 shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center mb-4 text-3xl shadow-sm">
              🎉
            </div>
            <h4 className="font-rubik text-lg text-stone-900 font-bold mb-2">Zero-Fear Friendly Play</h4>
            <p className="font-jakarta text-xs sm:text-sm text-stone-600 leading-relaxed">
              Low-floor, high-ceiling mechanics allow kindergarteners and 5th graders to play together at the exact same kitchen table happily!
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Modal: Game Assistant / Strategy Companion */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-4 border-amber-300 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center text-amber-900 transition-colors font-bold text-lg"
              type="button"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-md">
                🎮
              </div>
              <div>
                <span className="font-jakarta text-xs text-purple-700 font-extrabold uppercase tracking-wider">Playground Companion</span>
                <h3 className="font-rubik text-xl text-stone-900 font-black">{assistantGameTitle}</h3>
              </div>
            </div>

            <div className="bg-amber-50/90 border-2 border-amber-200 p-4 rounded-2xl mb-5">
              <div className="font-jakarta text-xs text-amber-900 mb-1 font-bold">Live Question &amp; Turn Tracker</div>
              <div className="flex items-center justify-between">
                <div className="font-rubik text-2xl text-amber-900 font-black">
                  Guess #{assistantTurnCount} 🎯
                </div>
                <button
                  onClick={() => { playPop(sfxEnabled); setAssistantTurnCount((prev) => prev + 1); }}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-jakarta text-xs font-black border-2 border-amber-500 shadow-sm bubbly-button"
                  type="button"
                >
                  + Next Guess!
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="font-rubik text-sm text-stone-800 font-bold">Kid-Friendly Strategy Prompts:</div>
              <ul className="space-y-2 text-stone-700 font-jakarta text-xs">
                <li className="flex items-start gap-2 bg-purple-50 border border-purple-200 p-3 rounded-2xl">
                  <span className="text-purple-600 text-base">🔍</span>
                  <span>“Is your secret number a friendly multiple of 10?”</span>
                </li>
                <li className="flex items-start gap-2 bg-sky-50 border border-sky-200 p-3 rounded-2xl">
                  <span className="text-sky-600 text-base">⚡</span>
                  <span>“Does it have an odd number in the ones place?”</span>
                </li>
                <li className="flex items-start gap-2 bg-rose-50 border border-rose-200 p-3 rounded-2xl">
                  <span className="text-rose-600 text-base">🎲</span>
                  <span>“Is it between 20 and 40?”</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { playPop(sfxEnabled); setAssistantTurnCount(1); }}
                className="flex-1 py-3 rounded-2xl bg-amber-100 text-amber-900 font-jakarta text-sm font-bold border border-amber-300 hover:bg-amber-200 bubbly-button"
                type="button"
              >
                🔄 Reset Counter
              </button>
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-jakarta text-sm font-black border-2 border-emerald-600 shadow-md bubbly-button"
                type="button"
              >
                🎉 Done Playing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
