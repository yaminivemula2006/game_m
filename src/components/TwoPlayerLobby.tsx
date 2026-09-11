import React, { useState } from 'react';
import { ScreenTab } from '../types';
import { playPop, playSuccess } from '../utils/audio';

interface TwoPlayerLobbyProps {
  onStartDuel: (targetScreen: ScreenTab) => void;
  sfxEnabled: boolean;
}

interface CharacterOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  role: string;
}

const CHARACTERS: CharacterOption[] = [
  { id: 'bear', name: 'Bear Scout', emoji: '🐻', color: 'bg-sky-100 border-sky-300 text-sky-900', role: 'Speed Counter' },
  { id: 'fox', name: 'Speedy Fox', emoji: '🦊', color: 'bg-amber-100 border-amber-300 text-amber-900', role: 'Quick Reflexes' },
  { id: 'bunny', name: 'Cosmic Bunny', emoji: '🐰', color: 'bg-pink-100 border-pink-300 text-pink-900', role: 'Mental Leap' },
  { id: 'lion', name: 'Math Lion', emoji: '🦁', color: 'bg-yellow-100 border-yellow-300 text-yellow-900', role: 'Strategy King' },
  { id: 'panda', name: 'Bubble Panda', emoji: '🐼', color: 'bg-emerald-100 border-emerald-300 text-emerald-900', role: 'Steady Adds' },
  { id: 'tiger', name: 'Turbo Tiger', emoji: '🐯', color: 'bg-orange-100 border-orange-300 text-orange-900', role: 'Blitz Master' },
  { id: 'unicorn', name: 'Star Unicorn', emoji: '🦄', color: 'bg-purple-100 border-purple-300 text-purple-900', role: 'Pattern Seeker' },
  { id: 'owl', name: 'Wise Owl', emoji: '🦉', color: 'bg-teal-100 border-teal-300 text-teal-900', role: 'Logic Ace' }
];

export const TwoPlayerLobby: React.FC<TwoPlayerLobbyProps> = ({
  onStartDuel,
  sfxEnabled
}) => {
  const [selectedArena, setSelectedArena] = useState<ScreenTab>('card-duel');
  const [matchLength, setMatchLength] = useState<'3' | '5' | 'sudden'>('3');
  const [difficulty, setDifficulty] = useState<'junior' | 'wizard'>('junior');

  // Player 1 & 2 Customization
  const [editingTarget, setEditingTarget] = useState<'p1' | 'p2'>('p1');
  const [p1Char, setP1Char] = useState<CharacterOption>(CHARACTERS[0]);
  const [p1Name, setP1Name] = useState('SpeedyBear');
  const [p2Connected, setP2Connected] = useState(true);
  const [p2Char, setP2Char] = useState<CharacterOption>(CHARACTERS[1]);
  const [p2Name, setP2Name] = useState('SparkyFox');

  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    playPop(sfxEnabled);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('https://mathventure.fun/join?r=CANDY-77');
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSelectCharacter = (char: CharacterOption) => {
    playPop(sfxEnabled);
    if (editingTarget === 'p1') {
      setP1Char(char);
      setP1Name(char.name.replace(/\s/g, ''));
    } else {
      setP2Char(char);
      setP2Name(char.name.replace(/\s/g, ''));
      setP2Connected(true);
    }
  };

  const handleConnectBot = () => {
    playSuccess(sfxEnabled);
    setP2Connected(true);
    setP2Char(CHARACTERS[3]); // Math Lion
    setP2Name('RoboBuddy 🤖');
  };

  const handleLaunch = () => {
    playSuccess(sfxEnabled);
    onStartDuel(selectedArena);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner with Room Code */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-4">
        <div className="bg-gradient-to-r from-blue-100/90 via-indigo-100/70 to-purple-100/80 border-2 border-blue-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-200/90 text-blue-950 font-jakarta font-black mb-2 text-xs uppercase tracking-wider">
              <span>🤝 REAL-TIME 2-PLAYER PARTY</span>
              <span>•</span>
              <span>📱 Same Device or Split Tablet</span>
            </div>
            <h1 className="font-rubik text-3xl sm:text-4xl text-blue-950 font-black flex items-center gap-2">
              Candy Battle Arena <span className="text-amber-500">🏆👥</span>
            </h1>
            <p className="mt-2 font-jakarta text-sm sm:text-base text-stone-700 font-medium max-w-2xl">
              Challenge a classmate, sibling, or family member! Choose your avatar, lock in match rules, and compete in head-to-head numeracy action!
            </p>
          </div>

          {/* Room Code Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/95 border-2 border-blue-300 p-4 rounded-3xl shadow-sm shrink-0">
            <div>
              <span className="font-jakarta text-[11px] text-stone-500 uppercase font-extrabold block">
                Party Room Code:
              </span>
              <span className="font-rubik text-2xl text-blue-900 font-black tracking-widest">
                CANDY-77
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-jakarta text-xs font-black border-2 border-blue-700 shadow-sm bubbly-button"
              type="button"
            >
              {copiedLink ? 'Copied! ✔️' : 'Copy Link 🔗'}
            </button>
          </div>
        </div>
      </section>

      {/* Choose Battle Arena Tabs */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-2">
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <span className="font-jakarta text-xs text-stone-700 font-extrabold flex items-center gap-2">
            <span>⚔️</span> Select Arena Game:
          </span>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => { playPop(sfxEnabled); setSelectedArena('card-duel'); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-jakarta text-xs font-black transition-all bubbly-button ${
                selectedArena === 'card-duel'
                  ? 'bg-sky-500 text-white border-2 border-sky-600 shadow-sm'
                  : 'bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              ⚡ Card Duel (Add/Multiply)
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setSelectedArena('race-to-100'); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-jakarta text-xs font-black transition-all bubbly-button ${
                selectedArena === 'race-to-100'
                  ? 'bg-orange-500 text-white border-2 border-orange-600 shadow-sm'
                  : 'bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              🎲 Race to 100
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setSelectedArena('guess-my-number'); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-jakarta text-xs font-black transition-all bubbly-button ${
                selectedArena === 'guess-my-number'
                  ? 'bg-purple-500 text-white border-2 border-purple-600 shadow-sm'
                  : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              🔍 Guess My Number
            </button>
          </div>
        </div>
      </section>

      {/* 1v1 Center Matchup Arena */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md flex flex-col items-center gap-8 relative overflow-hidden">
          {/* Background stadium glow */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>

          <div className="w-full flex flex-col md:flex-row items-center justify-around gap-8 relative z-10">
            {/* Player 1 Card */}
            <div className="w-full max-w-xs bg-gradient-to-b from-sky-50 to-white border-4 border-sky-300 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg relative">
              <span className="absolute -top-3 px-3 py-1 bg-sky-500 text-white font-jakarta text-[11px] font-black rounded-full shadow-sm">
                HOST • PLAYER 1
              </span>
              <div className="w-24 h-24 rounded-3xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-5xl shadow-inner mt-2 mb-3">
                {p1Char.emoji}
              </div>
              <h3 className="font-rubik text-xl text-stone-900 font-black">{p1Name}</h3>
              <span className="font-jakarta text-xs text-sky-700 font-bold">{p1Char.name} • {p1Char.role}</span>

              <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-sky-100 font-jakarta text-xs">
                <div className="bg-sky-50 p-2 rounded-xl">
                  <span className="text-[10px] text-sky-600 block">Streak</span>
                  <span className="font-rubik font-black text-sky-950">5 🔥</span>
                </div>
                <div className="bg-sky-50 p-2 rounded-xl">
                  <span className="text-[10px] text-sky-600 block">Buzzer Key</span>
                  <span className="font-rubik font-black text-sky-950">[Key A]</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Ready to Duel!
              </div>
            </div>

            {/* VS Emblem */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 border-4 border-white shadow-xl flex items-center justify-center font-rubik text-3xl font-black text-white select-none rotate-6">
                VS
              </div>
              <span className="font-jakarta text-xs text-stone-500 font-extrabold uppercase tracking-wider">
                1 v 1 Clash
              </span>
            </div>

            {/* Player 2 Card */}
            {p2Connected ? (
              <div className="w-full max-w-xs bg-gradient-to-b from-amber-50 to-white border-4 border-amber-300 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg relative">
                <span className="absolute -top-3 px-3 py-1 bg-amber-500 text-white font-jakarta text-[11px] font-black rounded-full shadow-sm">
                  CHALLENGER • PLAYER 2
                </span>
                <div className="w-24 h-24 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-inner mt-2 mb-3">
                  {p2Char.emoji}
                </div>
                <h3 className="font-rubik text-xl text-stone-900 font-black">{p2Name}</h3>
                <span className="font-jakarta text-xs text-amber-800 font-bold">{p2Char.name} • {p2Char.role}</span>

                <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-amber-100 font-jakarta text-xs">
                  <div className="bg-amber-50 p-2 rounded-xl">
                    <span className="text-[10px] text-amber-700 block">Streak</span>
                    <span className="font-rubik font-black text-amber-950">3 🔥</span>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-xl">
                    <span className="text-[10px] text-amber-700 block">Buzzer Key</span>
                    <span className="font-rubik font-black text-amber-950">[Key L]</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Connected &amp; Ready!
                </div>
              </div>
            ) : (
              /* Waiting for challenger */
              <div className="w-full max-w-xs bg-stone-50 border-4 border-dashed border-stone-300 rounded-3xl p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-stone-200 border-2 border-stone-300 flex items-center justify-center text-3xl mb-3 animate-pulse">
                  📡
                </div>
                <h4 className="font-rubik text-base text-stone-700 font-bold">Waiting for Player 2...</h4>
                <p className="font-jakarta text-xs text-stone-500 mt-1">
                  Connect on same keyboard by pressing [Key L] or join with second device.
                </p>
                <button
                  onClick={handleConnectBot}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-white font-jakarta text-xs font-black shadow-sm bubbly-button"
                  type="button"
                >
                  Add RoboBot Buddy 🤖
                </button>
              </div>
            )}
          </div>

          {/* Master Start Duel Launch Button */}
          <button
            onClick={handleLaunch}
            className="w-full max-w-md h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white rounded-3xl font-jakarta text-xl font-black border-4 border-emerald-600 shadow-xl bubbly-button flex items-center justify-center gap-3 relative z-10"
            type="button"
          >
            <span>🚀</span>
            START DUEL IN ARENA!
            <span>⚡</span>
          </button>
        </div>
      </section>

      {/* Avatar Picker & QR Code Joining Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR Code Tablet Joining (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-md flex flex-col items-center text-center gap-4">
            <span className="font-rubik text-base text-stone-900 font-black flex items-center gap-2">
              <span>📱</span> Scan to Join on Tablet
            </span>
            <p className="font-jakarta text-xs text-stone-600">
              Point a second tablet or phone camera at this QR code to join room <strong>CANDY-77</strong> instantly!
            </p>

            {/* Stylized Crisp SVG QR Code */}
            <div className="p-3 bg-white border-2 border-amber-300 rounded-2xl shadow-inner">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#FFFDF7" rx="8" />
                {/* Corner Markers */}
                <rect x="10" y="10" width="24" height="24" rx="4" fill="#0284C7" />
                <rect x="14" y="14" width="16" height="16" rx="2" fill="#FFFFFF" />
                <rect x="18" y="18" width="8" height="8" rx="1" fill="#0284C7" />

                <rect x="66" y="10" width="24" height="24" rx="4" fill="#EA580C" />
                <rect x="70" y="14" width="16" height="16" rx="2" fill="#FFFFFF" />
                <rect x="74" y="18" width="8" height="8" rx="1" fill="#EA580C" />

                <rect x="10" y="66" width="24" height="24" rx="4" fill="#9333EA" />
                <rect x="14" y="70" width="16" height="16" rx="2" fill="#FFFFFF" />
                <rect x="18" y="74" width="8" height="8" rx="1" fill="#9333EA" />

                {/* Data Grid Dots */}
                <rect x="42" y="14" width="6" height="6" fill="#F59E0B" rx="1" />
                <rect x="52" y="14" width="6" height="6" fill="#0284C7" rx="1" />
                <rect x="42" y="24" width="6" height="6" fill="#0284C7" rx="1" />
                <rect x="42" y="42" width="16" height="16" fill="#10B981" rx="3" />
                <rect x="66" y="42" width="6" height="6" fill="#EA580C" rx="1" />
                <rect x="76" y="42" width="6" height="6" fill="#F59E0B" rx="1" />
                <rect x="66" y="52" width="6" height="6" fill="#0284C7" rx="1" />
                <rect x="42" y="66" width="6" height="6" fill="#9333EA" rx="1" />
                <rect x="52" y="66" width="6" height="6" fill="#EA580C" rx="1" />
                <rect x="66" y="66" width="6" height="6" fill="#0284C7" rx="1" />
                <rect x="76" y="76" width="8" height="8" fill="#10B981" rx="2" />
              </svg>
            </div>

            <div className="font-mono text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-bold">
              mathventure.fun/join?r=CANDY-77
            </div>
            <span className="font-jakarta text-[11px] text-stone-500">
              💡 Works with any standard browser camera without app downloads!
            </span>
          </div>

          {/* Pick Your Arena Buddy (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-md flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-rubik text-base text-stone-900 font-black flex items-center gap-2">
                <span>🎨</span> Pick Your Arena Buddy!
              </span>

              {/* Target Player Toggle */}
              <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200">
                <button
                  onClick={() => { playPop(sfxEnabled); setEditingTarget('p1'); }}
                  className={`px-3 py-1 rounded-lg font-jakarta text-xs font-black transition-all ${
                    editingTarget === 'p1' ? 'bg-sky-500 text-white shadow-sm' : 'text-stone-700'
                  }`}
                >
                  Player 1 🐻
                </button>
                <button
                  onClick={() => { playPop(sfxEnabled); setEditingTarget('p2'); }}
                  className={`px-3 py-1 rounded-lg font-jakarta text-xs font-black transition-all ${
                    editingTarget === 'p2' ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-700'
                  }`}
                >
                  Player 2 🦊
                </button>
              </div>
            </div>

            {/* 8 Animal Avatars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHARACTERS.map((char) => {
                const isSelected =
                  (editingTarget === 'p1' && p1Char.id === char.id) ||
                  (editingTarget === 'p2' && p2Char.id === char.id);
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectCharacter(char)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-transform bubbly-button ${
                      isSelected ? 'ring-2 ring-blue-500 scale-105 ' + char.color : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                    }`}
                    type="button"
                  >
                    <span className="text-3xl">{char.emoji}</span>
                    <span className="font-rubik text-xs font-black text-stone-900">{char.name}</span>
                    <span className="font-jakarta text-[10px] text-stone-500">{char.role}</span>
                  </button>
                );
              })}
            </div>

            {/* Nickname Editor */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="font-jakarta text-xs font-bold text-stone-700">Nickname:</span>
                <input
                  type="text"
                  value={editingTarget === 'p1' ? p1Name : p2Name}
                  onChange={(e) => {
                    if (editingTarget === 'p1') setP1Name(e.target.value);
                    else setP2Name(e.target.value);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 font-rubik text-sm font-bold bg-white focus:outline-none focus:border-blue-400"
                  maxLength={15}
                />
              </div>

              {/* Match Length & Difficulty */}
              <div className="flex items-center gap-2">
                <select
                  value={matchLength}
                  onChange={(e) => setMatchLength(e.target.value as '3' | '5' | 'sudden')}
                  className="px-2.5 py-1.5 rounded-xl border border-stone-300 font-jakarta text-xs font-bold bg-white"
                >
                  <option value="3">Best of 3</option>
                  <option value="5">Best of 5</option>
                  <option value="sudden">Sudden Death</option>
                </select>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'junior' | 'wizard')}
                  className="px-2.5 py-1.5 rounded-xl border border-stone-300 font-jakarta text-xs font-bold bg-white"
                >
                  <option value="junior">Junior (Ages 6–8)</option>
                  <option value="wizard">Wizard (Ages 9–12)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
