import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playPop, playZap, playSuccess, speakPrompt } from '../utils/audio';

interface GuessMyNumberProps {
  sfxEnabled: boolean;
}

export const GuessMyNumber: React.FC<GuessMyNumberProps> = ({ sfxEnabled }) => {
  const [mode, setMode] = useState<'junior' | 'master'>('junior');
  const maxNumber = mode === 'junior' ? 20 : 100;

  const [secretNumber, setSecretNumber] = useState<number>(() => Math.floor(Math.random() * 20) + 1);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());
  const [cluesAsked, setCluesAsked] = useState<number>(0);
  const [clueCategory, setClueCategory] = useState<'parity' | 'magnitude' | 'placeValue' | 'multiples'>('parity');
  const [recentAnswer, setRecentAnswer] = useState<{ text: string; isYes: boolean } | null>(null);

  // Initialize new secret
  const generateNewSecret = (newMax = maxNumber) => {
    playPop(sfxEnabled);
    const newSec = Math.floor(Math.random() * newMax) + 1;
    setSecretNumber(newSec);
    setRevealed(false);
    setEliminated(new Set());
    setCluesAsked(0);
    setRecentAnswer(null);
  };

  useEffect(() => {
    generateNewSecret(maxNumber);
  }, [mode]);

  const toggleTile = (num: number) => {
    playZap(sfxEnabled);
    setEliminated((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  // Shortcut zappers
  const zapEvens = () => {
    playZap(sfxEnabled);
    setEliminated((prev) => {
      const next = new Set(prev);
      for (let i = 1; i <= maxNumber; i++) {
        if (i % 2 === 0) next.add(i);
      }
      return next;
    });
  };

  const zapOdds = () => {
    playZap(sfxEnabled);
    setEliminated((prev) => {
      const next = new Set(prev);
      for (let i = 1; i <= maxNumber; i++) {
        if (i % 2 !== 0) next.add(i);
      }
      return next;
    });
  };

  const zapLowerHalf = () => {
    playZap(sfxEnabled);
    const mid = Math.floor(maxNumber / 2);
    setEliminated((prev) => {
      const next = new Set(prev);
      for (let i = 1; i <= mid; i++) {
        next.add(i);
      }
      return next;
    });
  };

  const zapUpperHalf = () => {
    playZap(sfxEnabled);
    const mid = Math.floor(maxNumber / 2);
    setEliminated((prev) => {
      const next = new Set(prev);
      for (let i = mid + 1; i <= maxNumber; i++) {
        next.add(i);
      }
      return next;
    });
  };

  const clearAllStrikes = () => {
    playPop(sfxEnabled);
    setEliminated(new Set());
  };

  // Automated Clue Question Evaluator
  const askQuestionClue = (questionText: string, checker: (num: number) => boolean) => {
    playPop(sfxEnabled);
    setCluesAsked((prev) => prev + 1);
    const answer = checker(secretNumber);
    setRecentAnswer({
      text: `${questionText} ➔ ${answer ? 'YES! 🎉' : 'NO ❌'}`,
      isYes: answer
    });

    if (answer) {
      playSuccess(sfxEnabled);
    } else {
      playZap(sfxEnabled);
    }
  };

  // Color generator for candy tiles
  const getTileColor = (num: number) => {
    const isEliminated = eliminated.has(num);
    if (isEliminated) {
      return 'bg-stone-200/80 text-stone-400 border-stone-300 line-through scale-95 opacity-50';
    }
    const colors = [
      'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200',
      'bg-sky-100/90 text-sky-900 border-sky-300 hover:bg-sky-200',
      'bg-purple-100/90 text-purple-900 border-purple-300 hover:bg-purple-200',
      'bg-rose-100/90 text-rose-900 border-rose-300 hover:bg-rose-200',
      'bg-emerald-100/90 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
    ];
    return colors[num % colors.length];
  };

  const remainingCount = maxNumber - eliminated.size;

  useEffect(() => {
    if (remainingCount === 1 && !eliminated.has(secretNumber)) {
      playSuccess(sfxEnabled);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [remainingCount, eliminated, secretNumber, sfxEnabled]);

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner & Mode Toggle */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-4">
        <div className="bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-amber-100/80 border-2 border-purple-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-200/90 text-purple-950 font-jakarta font-black mb-2 text-xs uppercase tracking-wider">
              <span>🎈 ZERO SUPPLIES NEEDED!</span>
              <span>•</span>
              <span>⭐ Ages 4–10</span>
              <span>•</span>
              <span>👥 2+ Players</span>
            </div>
            <h1 className="font-rubik text-3xl sm:text-4xl text-purple-950 font-black flex items-center gap-2">
              Guess My Number <span className="text-amber-500">🔍⭐</span>
            </h1>
            <p className="mt-2 font-jakarta text-sm sm:text-base text-stone-700 font-medium max-w-2xl">
              Step into the detective playground! Deduce the mystery target using snappy question clues, place-value secrets, and candy-colored board eliminations.
            </p>
          </div>

          {/* Junior vs Master Toggle */}
          <div className="flex p-1.5 bg-white/90 rounded-2xl border-2 border-purple-300 shadow-sm shrink-0">
            <button
              onClick={() => setMode('junior')}
              className={`px-4 py-2 rounded-xl font-jakarta text-xs sm:text-sm font-extrabold transition-all ${
                mode === 'junior'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-purple-900'
              }`}
            >
              🌱 Junior Explorers (1–20)
            </button>
            <button
              onClick={() => setMode('master')}
              className={`px-4 py-2 rounded-xl font-jakarta text-xs sm:text-sm font-extrabold transition-all ${
                mode === 'master'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-purple-900'
              }`}
            >
              🚀 Master Detectives (1–100)
            </button>
          </div>
        </div>
      </section>

      {/* Main Deduction Stage: 2-Column Responsive Layout */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Host Vault, Clue Logger, Detective Coach */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Host Secret Vault */}
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔐</span>
                  <span className="font-rubik text-base text-stone-900 font-black">
                    Secret Target Vault
                  </span>
                </div>
                <span className="font-jakarta text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Range: 1 – {maxNumber}
                </span>
              </div>

              {/* Secret Peek Box */}
              <div className="p-4 bg-purple-50/80 rounded-2xl border-2 border-purple-200 flex items-center justify-between">
                <div>
                  <span className="font-jakarta text-xs text-purple-900 font-semibold block">
                    {revealed ? 'Secret Number Revealed:' : 'Target Locked in Vault:'}
                  </span>
                  <div className="font-rubik text-3xl font-black text-purple-900 mt-1">
                    {revealed ? secretNumber : '🔒 ? ?'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playPop(sfxEnabled);
                      setRevealed(!revealed);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-200 text-purple-900 font-jakarta text-xs font-black border border-purple-300 hover:bg-purple-300 transition-colors bubbly-button"
                    type="button"
                  >
                    {revealed ? 'Hide 🙈' : 'Peek 👁️'}
                  </button>
                  <button
                    onClick={() => generateNewSecret()}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-jakarta text-xs font-black border-2 border-purple-700 shadow-sm bubbly-button"
                    type="button"
                  >
                    🎲 New Secret!
                  </button>
                </div>
              </div>

              {/* Clues Asked & Recent Evaluation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-center">
                  <span className="font-jakarta text-[11px] text-amber-800 font-extrabold block">Clues Asked</span>
                  <span className="font-rubik text-2xl text-amber-950 font-black">{cluesAsked}</span>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-center">
                  <span className="font-jakarta text-[11px] text-emerald-800 font-extrabold block">Candidates Left</span>
                  <span className="font-rubik text-2xl text-emerald-950 font-black">{remainingCount}</span>
                </div>
              </div>

              {/* Recent Answer Banner */}
              {recentAnswer && (
                <div
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between font-jakarta text-xs font-extrabold ${
                    recentAnswer.isYes
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : 'bg-rose-100 border-rose-400 text-rose-900'
                  }`}
                >
                  <span>{recentAnswer.text}</span>
                  <button
                    onClick={() => speakPrompt(recentAnswer.text)}
                    className="p-1 rounded-lg bg-white/70 hover:bg-white text-stone-800 text-sm"
                    title="Speak Answer"
                  >
                    🔊
                  </button>
                </div>
              )}

              {/* Elimination Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                  <span>Elimination Meter</span>
                  <span>{eliminated.size} / {maxNumber} crossed off</span>
                </div>
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(eliminated.size / maxNumber) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Coach Buddy's Super Tip */}
            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-3xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-amber-300 text-amber-600 flex items-center justify-center text-2xl shrink-0 shadow-sm rotate-2">
                🦁
              </div>
              <div>
                <span className="font-jakarta text-xs text-amber-900 font-extrabold uppercase tracking-wider block">
                  Coach Buddy's Super Strategy
                </span>
                <p className="font-jakarta text-xs text-amber-950 font-medium leading-relaxed mt-1">
                  “Don't guess single numbers right away! Splitting the board in half (e.g. <em>'Is it greater than {Math.floor(maxNumber / 2)}?'</em>) eliminates 50% of possibilities in one single question!”
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Interactive Board & Detective Clue Cards */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Elimination Board */}
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪄</span>
                  <span className="font-rubik text-base text-stone-900 font-black">
                    Interactive Deduction Board
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={zapEvens}
                    className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-jakarta text-[11px] font-bold border border-purple-200 bubbly-button"
                    type="button"
                  >
                    Zap Evens
                  </button>
                  <button
                    onClick={zapOdds}
                    className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-jakarta text-[11px] font-bold border border-purple-200 bubbly-button"
                    type="button"
                  >
                    Zap Odds
                  </button>
                  <button
                    onClick={zapLowerHalf}
                    className="px-2.5 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-jakarta text-[11px] font-bold border border-sky-200 bubbly-button"
                    type="button"
                  >
                    ≤ {Math.floor(maxNumber / 2)}
                  </button>
                  <button
                    onClick={zapUpperHalf}
                    className="px-2.5 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-jakarta text-[11px] font-bold border border-sky-200 bubbly-button"
                    type="button"
                  >
                    &gt; {Math.floor(maxNumber / 2)}
                  </button>
                  <button
                    onClick={clearAllStrikes}
                    className="px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-jakarta text-[11px] font-bold border border-rose-200 bubbly-button"
                    type="button"
                  >
                    Reset 🔄
                  </button>
                </div>
              </div>

              {/* Candy Tiles Grid */}
              <div
                className={`grid gap-2 p-3 bg-purple-50/40 rounded-2xl border border-purple-100 max-h-[380px] overflow-y-auto ${
                  mode === 'junior' ? 'grid-cols-5 sm:grid-cols-5' : 'grid-cols-10 sm:grid-cols-10 text-xs'
                }`}
              >
                {Array.from({ length: maxNumber }, (_, i) => i + 1).map((num) => {
                  const isElim = eliminated.has(num);
                  return (
                    <button
                      key={num}
                      onClick={() => toggleTile(num)}
                      className={`h-11 rounded-xl font-rubik font-black border-2 transition-all flex items-center justify-center relative select-none bubbly-button ${getTileColor(
                        num
                      )} ${mode === 'junior' ? 'text-lg' : 'text-xs'}`}
                      type="button"
                      title={isElim ? `Number ${num} (Eliminated)` : `Number ${num}`}
                    >
                      {num}
                      {isElim && (
                        <span className="absolute inset-0 flex items-center justify-center text-rose-500 font-black text-sm">
                          ✕
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status footer for board */}
              <div className="flex items-center justify-between text-xs text-stone-600 font-jakarta font-semibold">
                <span>💡 Tap any candy number to cross out or restore!</span>
                {remainingCount === 1 && (
                  <span className="font-rubik text-emerald-600 font-black animate-bounce">
                    🎉 Mystery Number Solved!
                  </span>
                )}
              </div>
            </div>

            {/* Detective Clue Cards (Voice + Auto-Ask) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-rubik text-base text-stone-900 font-black flex items-center gap-2">
                  <span>💡</span> Detective Clue Cards &amp; Audio Prompts
                </span>
                <span className="font-jakarta text-[11px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                  Tap to Ask &amp; Test!
                </span>
              </div>

              {/* Category Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-purple-50 rounded-2xl border border-purple-200">
                <button
                  onClick={() => { playPop(sfxEnabled); setClueCategory('parity'); }}
                  className={`py-1.5 px-2 rounded-xl text-center font-jakarta text-xs font-extrabold transition-all ${
                    clueCategory === 'parity' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  🐱 Parity (Odd/Even)
                </button>
                <button
                  onClick={() => { playPop(sfxEnabled); setClueCategory('magnitude'); }}
                  className={`py-1.5 px-2 rounded-xl text-center font-jakarta text-xs font-extrabold transition-all ${
                    clueCategory === 'magnitude' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  🦁 Magnitude (&gt; / &lt;)
                </button>
                <button
                  onClick={() => { playPop(sfxEnabled); setClueCategory('placeValue'); }}
                  className={`py-1.5 px-2 rounded-xl text-center font-jakarta text-xs font-extrabold transition-all ${
                    clueCategory === 'placeValue' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  🐰 Place Value
                </button>
                <button
                  onClick={() => { playPop(sfxEnabled); setClueCategory('multiples'); }}
                  className={`py-1.5 px-2 rounded-xl text-center font-jakarta text-xs font-extrabold transition-all ${
                    clueCategory === 'multiples' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  🦊 Skip Counting
                </button>
              </div>

              {/* List of interactive Clues for chosen category */}
              <div className="space-y-2.5">
                {clueCategory === 'parity' && (
                  <>
                    <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-purple-950 font-bold">“Is it an even number?”</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt('Is it an even number?')}
                          className="px-2.5 py-1 rounded-xl bg-purple-200 text-purple-900 text-xs font-bold hover:bg-purple-300"
                          title="Speak Hint"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue('Is it an even number?', (n) => n % 2 === 0)}
                          className="px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-purple-950 font-bold">“Can you share it equally between 2 friends?”</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt('Can you share it equally between two friends?')}
                          className="px-2.5 py-1 rounded-xl bg-purple-200 text-purple-900 text-xs font-bold hover:bg-purple-300"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue('Can you share it equally?', (n) => n % 2 === 0)}
                          className="px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {clueCategory === 'magnitude' && (
                  <>
                    <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-sky-950 font-bold">
                        “Is it greater than {Math.floor(maxNumber / 2)}?”
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt(`Is it greater than ${Math.floor(maxNumber / 2)}?`)}
                          className="px-2.5 py-1 rounded-xl bg-sky-200 text-sky-900 text-xs font-bold hover:bg-sky-300"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue(`Is it > ${Math.floor(maxNumber / 2)}?`, (n) => n > Math.floor(maxNumber / 2))}
                          className="px-3 py-1 rounded-xl bg-sky-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-sky-950 font-bold">
                        “Is it less than {Math.floor(maxNumber / 4)}?”
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt(`Is it less than ${Math.floor(maxNumber / 4)}?`)}
                          className="px-2.5 py-1 rounded-xl bg-sky-200 text-sky-900 text-xs font-bold hover:bg-sky-300"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue(`Is it < ${Math.floor(maxNumber / 4)}?`, (n) => n < Math.floor(maxNumber / 4))}
                          className="px-3 py-1 rounded-xl bg-sky-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {clueCategory === 'placeValue' && (
                  <>
                    <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-rose-950 font-bold">“Does the ones digit end with 0 or 5?”</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt('Does the ones digit end with zero or five?')}
                          className="px-2.5 py-1 rounded-xl bg-rose-200 text-rose-900 text-xs font-bold hover:bg-rose-300"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue('Does ones digit end with 0 or 5?', (n) => n % 5 === 0)}
                          className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-rose-950 font-bold">“Is it a single digit number (1–9)?”</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt('Is it a single digit number?')}
                          className="px-2.5 py-1 rounded-xl bg-rose-200 text-rose-900 text-xs font-bold hover:bg-rose-300"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue('Is it a single digit number?', (n) => n < 10)}
                          className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {clueCategory === 'multiples' && (
                  <>
                    <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-amber-950 font-bold">“Do you land on it when counting by 5s?”</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt('Do you land on it when skip counting by fives?')}
                          className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-300"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue('Do you land on it counting by 5s?', (n) => n % 5 === 0)}
                          className="px-3 py-1 rounded-xl bg-amber-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                      <span className="font-jakarta text-xs text-amber-950 font-bold">“Is it an exact multiple of 10?”</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => speakPrompt('Is it an exact multiple of ten?')}
                          className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-300"
                        >
                          🎧 Hear
                        </button>
                        <button
                          onClick={() => askQuestionClue('Is it a multiple of 10?', (n) => n % 10 === 0)}
                          className="px-3 py-1 rounded-xl bg-amber-600 text-white text-xs font-black shadow-sm bubbly-button"
                        >
                          Ask Host! ❓
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pedagogical Takeaways & Printable Cheat-Sheet */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 mb-8">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-jakarta text-xs font-black text-purple-700 uppercase tracking-wider block mb-1">
              Why Verbal Elimination Builds True Mathematical Intuition 💡
            </span>
            <h3 className="font-rubik text-xl sm:text-2xl text-stone-900 font-black">
              From Guessing to Computer Science Binary Search!
            </h3>
            <p className="font-jakarta text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              When children learn to ask category questions rather than calling out random numbers, they master logarithmic elimination, place-value decomposition, and articulating mathematical conjecture.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => speakPrompt('In Guess My Number, players take turns formulating mathematical hypotheses. Splitting the range in half is the fastest way to eliminate candidates!')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border-2 border-purple-300 text-purple-900 font-jakarta text-xs font-black hover:bg-purple-100 flex items-center justify-center gap-2 bubbly-button"
              type="button"
            >
              <span>🎧</span> 1-Min Audio Walkthrough
            </button>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 text-white font-jakarta text-xs font-black border-2 border-purple-700 shadow-md flex items-center justify-center gap-2 bubbly-button"
              type="button"
            >
              <span>🖨️</span> Print Clue Cards
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
