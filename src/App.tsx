import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenTab } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GamesHub } from './components/GamesHub';
import { GuessMyNumber } from './components/GuessMyNumber';
import { CardDuel } from './components/CardDuel';
import { RaceTo100 } from './components/RaceTo100';
import { TwoPlayerLobby } from './components/TwoPlayerLobby';
import { TeacherGuide } from './components/TeacherGuide';
import { playPop, playSuccess } from './utils/audio';

const AVATAR_CHOICES = [
  { emoji: '🐻', name: 'Bear Scout' },
  { emoji: '🦊', name: 'Speedy Fox' },
  { emoji: '🐰', name: 'Cosmic Bunny' },
  { emoji: '🦁', name: 'Math Lion' },
  { emoji: '🐼', name: 'Bubble Panda' },
  { emoji: '🐯', name: 'Turbo Tiger' },
  { emoji: '🦄', name: 'Star Unicorn' },
  { emoji: '🦉', name: 'Wise Owl' }
];

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('games-hub');
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [classroomMode, setClassroomMode] = useState(false);
  const [userAvatar, setUserAvatar] = useState('🐻');
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  const handleStartDuel = (targetScreen: ScreenTab) => {
    setCurrentTab(targetScreen);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        classroomMode ? 'bg-[#FFFBEB] text-[#1E293B]' : 'bg-[#FFFDF7] text-[#2B2D42]'
      }`}
    >
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        sfxEnabled={sfxEnabled}
        setSfxEnabled={setSfxEnabled}
        classroomMode={classroomMode}
        setClassroomMode={setClassroomMode}
        userAvatar={userAvatar}
        onAvatarClick={() => {
          playPop(sfxEnabled);
          setAvatarModalOpen(true);
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1 pt-24 pb-12 w-full">
        <AnimatePresence mode="wait">
          {currentTab === 'games-hub' && (
            <motion.div
              key="games-hub"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <GamesHub
                onNavigate={(tab) => {
                  playPop(sfxEnabled);
                  setCurrentTab(tab);
                }}
                sfxEnabled={sfxEnabled}
                onOpenCheatSheet={() => {
                  playPop(sfxEnabled);
                  setCheatSheetOpen(true);
                }}
              />
            </motion.div>
          )}

          {currentTab === 'guess-my-number' && (
            <motion.div
              key="guess-my-number"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <GuessMyNumber sfxEnabled={sfxEnabled} />
            </motion.div>
          )}

          {currentTab === 'card-duel' && (
            <motion.div
              key="card-duel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <CardDuel sfxEnabled={sfxEnabled} />
            </motion.div>
          )}

          {currentTab === 'race-to-100' && (
            <motion.div
              key="race-to-100"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <RaceTo100 sfxEnabled={sfxEnabled} />
            </motion.div>
          )}

          {currentTab === 'two-player-lobby' && (
            <motion.div
              key="two-player-lobby"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TwoPlayerLobby onStartDuel={handleStartDuel} sfxEnabled={sfxEnabled} />
            </motion.div>
          )}

          {currentTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TeacherGuide sfxEnabled={sfxEnabled} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Avatar Chooser Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-4 border-amber-300 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setAvatarModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center text-amber-900 font-bold"
              type="button"
            >
              ✕
            </button>

            <span className="text-3xl">🎨</span>
            <h3 className="font-rubik text-xl text-stone-900 font-black mt-2">
              Choose Your Explorer Avatar!
            </h3>
            <p className="font-jakarta text-xs text-stone-600 mt-1 mb-4">
              Tap any buddy to set as your primary profile player.
            </p>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {AVATAR_CHOICES.map((choice) => (
                <button
                  key={choice.name}
                  onClick={() => {
                    playSuccess(sfxEnabled);
                    setUserAvatar(choice.emoji);
                    setAvatarModalOpen(false);
                  }}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 transition-transform bubbly-button ${
                    userAvatar === choice.emoji
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 scale-105'
                      : 'bg-stone-50 border-stone-200 hover:bg-amber-50'
                  }`}
                  type="button"
                >
                  <span className="text-2xl">{choice.emoji}</span>
                  <span className="font-jakarta text-[10px] font-bold text-stone-700 truncate w-full text-center">
                    {choice.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setAvatarModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-jakarta text-xs font-black border-2 border-amber-600 shadow-sm"
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Pocket Cheat-Sheet Modal */}
      {cheatSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-4 border-amber-300 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setCheatSheetOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center text-amber-900 font-bold"
              type="button"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🖨️</span>
              <div>
                <span className="font-jakarta text-xs text-amber-700 font-extrabold uppercase tracking-wider">
                  Quick Reference
                </span>
                <h3 className="font-rubik text-xl text-stone-900 font-black">
                  MathVenture Pocket Cheat-Sheet
                </h3>
              </div>
            </div>

            <div className="space-y-3 font-jakarta text-xs text-stone-700 max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                <strong className="font-rubik text-sm text-purple-900 block mb-1">
                  1. Guess My Number (No toys needed)
                </strong>
                <p>Pick a number 1–20 (or 1–50). Other players can ask ONLY yes/no questions.</p>
                <p className="mt-1 text-purple-800 font-semibold">
                  Best questions: “Is it even?”, “Is it &gt; 25?”, “Does it end in 0 or 5?”
                </p>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
                <strong className="font-rubik text-sm text-sky-900 block mb-1">
                  2. Card Duel (1 standard deck)
                </strong>
                <p>Remove face cards (J, Q, K). Aces = 1. Flip 2 cards. First to call out the sum or product wins the pair.</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <strong className="font-rubik text-sm text-amber-900 block mb-1">
                  3. Race to 100 (2 dice + paper)
                </strong>
                <p>Roll 2 dice. Make a 2-digit number (e.g. 4 and 2 can be 42 or 24). Add to your score. Closest to 100 without busting wins!</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-2xl bg-amber-500 text-white font-jakarta text-xs font-black border-2 border-amber-600 shadow-md bubbly-button"
                type="button"
              >
                🖨️ Print Sheet
              </button>
              <button
                onClick={() => setCheatSheetOpen(false)}
                className="px-5 py-3 rounded-2xl bg-stone-100 text-stone-700 font-jakarta text-xs font-bold border border-stone-200 hover:bg-stone-200"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
