import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playPop, playCardFlip, playBuzzer, playSuccess } from '../utils/audio';

interface CardDuelProps {
  sfxEnabled: boolean;
}

interface CardItem {
  id: string;
  rank: number;
  displayRank: string;
  suit: '♠' | '♥' | '♦' | '♣';
  color: 'red' | 'black';
}

const SUITS: { symbol: '♠' | '♥' | '♦' | '♣'; color: 'red' | 'black' }[] = [
  { symbol: '♠', color: 'black' },
  { symbol: '♥', color: 'red' },
  { symbol: '♦', color: 'red' },
  { symbol: '♣', color: 'black' }
];

function generateRandomCard(): CardItem {
  const rank = Math.floor(Math.random() * 9) + 2; // 2 to 10
  const suitObj = SUITS[Math.floor(Math.random() * SUITS.length)];
  return {
    id: Math.random().toString(36).substring(7),
    rank,
    displayRank: rank === 1 ? 'A' : rank.toString(),
    suit: suitObj.symbol,
    color: suitObj.color
  };
}

export const CardDuel: React.FC<CardDuelProps> = ({ sfxEnabled }) => {
  const [duelType, setDuelType] = useState<'addition' | 'multiplication' | 'target'>('addition');

  // Duel State
  const [cardA, setCardA] = useState<CardItem>(() => ({
    id: 'c1',
    rank: 7,
    displayRank: '7',
    suit: '♦',
    color: 'red'
  }));
  const [cardB, setCardB] = useState<CardItem>(() => ({
    id: 'c2',
    rank: 8,
    displayRank: '8',
    suit: '♠',
    color: 'black'
  }));
  const [buzzedTeam, setBuzzedTeam] = useState<'bear' | 'fox' | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  // Scores
  const [bearScore, setBearScore] = useState(0);
  const [foxScore, setFoxScore] = useState(0);
  const [duelHistory, setDuelHistory] = useState<string[]>([]);

  // 4-Card Target Quest State
  const [targetGoal, setTargetGoal] = useState(20);
  const [targetHand, setTargetHand] = useState<CardItem[]>(() => [
    { id: 't1', rank: 3, displayRank: '3', suit: '♣', color: 'black' },
    { id: 't2', rank: 4, displayRank: '4', suit: '♦', color: 'red' },
    { id: 't3', rank: 5, displayRank: '5', suit: '♥', color: 'red' },
    { id: 't4', rank: 2, displayRank: '2', suit: '♠', color: 'black' }
  ]);
  const [equationTokens, setEquationTokens] = useState<string[]>([]);
  const [targetFeedback, setTargetFeedback] = useState<{ msg: string; success: boolean } | null>(null);

  // Deal new 2-card hand
  const dealNewDuel = () => {
    playCardFlip(sfxEnabled);
    setCardA(generateRandomCard());
    setCardB(generateRandomCard());
    setBuzzedTeam(null);
    setShowSolution(false);
  };

  // Deal new 4-card hand
  const dealNewTargetHand = () => {
    playCardFlip(sfxEnabled);
    setTargetHand([
      generateRandomCard(),
      generateRandomCard(),
      generateRandomCard(),
      generateRandomCard()
    ]);
    setEquationTokens([]);
    setTargetFeedback(null);
  };

  // Keyboard shortcut listener for Buzzers [A] and [L]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (duelType === 'target') return;
      if (buzzedTeam) return;

      if (e.key === 'a' || e.key === 'A') {
        playBuzzer(sfxEnabled);
        setBuzzedTeam('bear');
      } else if (e.key === 'l' || e.key === 'L') {
        playBuzzer(sfxEnabled);
        setBuzzedTeam('fox');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buzzedTeam, sfxEnabled, duelType]);

  const handleBuzz = (team: 'bear' | 'fox') => {
    if (buzzedTeam) return;
    playBuzzer(sfxEnabled);
    setBuzzedTeam(team);
  };

  const awardPoint = (team: 'bear' | 'fox') => {
    playSuccess(sfxEnabled);
    setShowSolution(true);
    if (team === 'bear') {
      setBearScore((prev) => prev + 1);
      setDuelHistory((prev) => [`🐻 Bear won (+1 pt)`, ...prev.slice(0, 4)]);
    } else {
      setFoxScore((prev) => prev + 1);
      setDuelHistory((prev) => [`🦊 Fox won (+1 pt)`, ...prev.slice(0, 4)]);
    }
  };

  const expectedAnswer =
    duelType === 'addition' ? cardA.rank + cardB.rank : cardA.rank * cardB.rank;

  // Target Quest Expression Evaluator
  const addToken = (token: string) => {
    playPop(sfxEnabled);
    setEquationTokens((prev) => [...prev, token]);
  };

  const removeLastToken = () => {
    playPop(sfxEnabled);
    setEquationTokens((prev) => prev.slice(0, -1));
  };

  const clearEquation = () => {
    playPop(sfxEnabled);
    setEquationTokens([]);
    setTargetFeedback(null);
  };

  const evaluateTarget = () => {
    try {
      const expr = equationTokens.join(' ').replace(/×/g, '*').replace(/÷/g, '/');
      if (!expr.trim()) return;

      // Safe mathematical evaluation of integers and standard operators
      if (!/^[\d\s+\-*/()]+$/.test(expr)) {
        setTargetFeedback({ msg: 'Invalid characters in equation!', success: false });
        return;
      }

      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${expr})`)();
      
      if (Math.abs(result - targetGoal) < 0.001) {
        playSuccess(sfxEnabled);
        try {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
        } catch {
          // Fallback
        }
        setTargetFeedback({
          msg: `🎉 Brilliant! ${equationTokens.join(' ')} = ${targetGoal}! You hit the target!`,
          success: true
        });
      } else {
        playBuzzer(sfxEnabled);
        setTargetFeedback({
          msg: `Result is ${result}, not ${targetGoal}. Try another operation!`,
          success: false
        });
      }
    } catch {
      setTargetFeedback({ msg: 'Check your equation syntax (e.g. unmatched parentheses)', success: false });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner with Physical Deck Instructions */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-4">
        <div className="bg-gradient-to-r from-sky-100/90 via-teal-100/70 to-amber-100/80 border-2 border-sky-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-200/90 text-sky-950 font-jakarta font-black mb-2 text-xs uppercase tracking-wider">
              <span>🃏 GRAB ANY DECK OF CARDS!</span>
              <span>•</span>
              <span>⭐ Ages 5–12</span>
              <span>•</span>
              <span>⚡ Fast Mental Agility</span>
            </div>
            <h1 className="font-rubik text-3xl sm:text-4xl text-sky-950 font-black flex items-center gap-2">
              Make the Target &amp; High Card Duel! <span className="text-amber-500">⚡🃏</span>
            </h1>
            <p className="mt-2 font-jakarta text-sm sm:text-base text-stone-700 font-medium max-w-2xl">
              Turn over cards face up! Slap the buzzer or keyboard button, shout the sum or product, and collect points. Or assemble 4 cards into target 20!
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-col sm:flex-row p-1.5 bg-white/90 rounded-2xl border-2 border-sky-300 shadow-sm shrink-0 gap-1">
            <button
              onClick={() => { playPop(sfxEnabled); setDuelType('addition'); }}
              className={`px-3.5 py-2 rounded-xl font-jakarta text-xs sm:text-sm font-extrabold transition-all ${
                duelType === 'addition'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-sky-900'
              }`}
            >
              ⚡ Ages 5–7 Addition Speed
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setDuelType('multiplication'); }}
              className={`px-3.5 py-2 rounded-xl font-jakarta text-xs sm:text-sm font-extrabold transition-all ${
                duelType === 'multiplication'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-sky-900'
              }`}
            >
              ✖️ Ages 8–10 Times Tables
            </button>
            <button
              onClick={() => { playPop(sfxEnabled); setDuelType('target'); }}
              className={`px-3.5 py-2 rounded-xl font-jakarta text-xs sm:text-sm font-extrabold transition-all ${
                duelType === 'target'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-sky-900'
              }`}
            >
              🎯 Ages 9–12 Target Quest
            </button>
          </div>
        </div>
      </section>

      {/* Main Game Arena */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {duelType !== 'target' ? (
              /* DUEL MODE: Addition or Multiplication */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-200 shadow-md flex flex-col items-center gap-6 relative overflow-hidden">
                {/* Physical Deck Banner Tip */}
                <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center font-jakarta text-xs text-amber-900 font-bold flex items-center justify-center gap-2">
                  <span>💡</span>
                  <span>
                    Playing with a physical deck? Flip two cards simultaneously on the table! Use this screen as your smart buzzer &amp; scoreboard!
                  </span>
                </div>

                {/* Team Buzzers & Center Cards */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 my-2">
                  {/* Bear Team Buzzer (Blue) */}
                  <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleBuzz('bear')}
                      className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center shadow-xl transition-all bubbly-button ${
                        buzzedTeam === 'bear'
                          ? 'bg-sky-500 border-sky-300 text-white scale-110 ring-4 ring-sky-300 animate-pulse'
                          : 'bg-gradient-to-b from-sky-400 to-sky-600 border-sky-300 text-white hover:brightness-110'
                      }`}
                      type="button"
                    >
                      <span className="text-4xl">🐻</span>
                      <span className="font-rubik text-base font-black mt-1">BEAR SLAP</span>
                      <span className="font-jakarta text-[11px] font-bold opacity-90">[Press A]</span>
                    </button>
                    <span className="font-rubik text-lg text-sky-900 font-black">Score: {bearScore}</span>
                  </div>

                  {/* Center Realistic Playing Cards Display */}
                  <div className="flex items-center gap-4 select-none">
                    {/* Card A */}
                    <div
                      className={`w-28 h-40 bg-white border-4 rounded-3xl p-3 flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1 ${
                        cardA.color === 'red'
                          ? 'border-rose-300 text-rose-600'
                          : 'border-slate-800 text-slate-900'
                      }`}
                    >
                      <div className="flex flex-col leading-none font-rubik font-black">
                        <span className="text-2xl">{cardA.displayRank}</span>
                        <span className="text-xl">{cardA.suit}</span>
                      </div>
                      <div className="text-center font-rubik text-4xl font-black">{cardA.suit}</div>
                      <div className="flex flex-col items-end leading-none font-rubik font-black rotate-180">
                        <span className="text-2xl">{cardA.displayRank}</span>
                        <span className="text-xl">{cardA.suit}</span>
                      </div>
                    </div>

                    {/* Operator */}
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 font-rubik text-2xl font-black flex items-center justify-center shadow-md">
                      {duelType === 'addition' ? '+' : '×'}
                    </div>

                    {/* Card B */}
                    <div
                      className={`w-28 h-40 bg-white border-4 rounded-3xl p-3 flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1 ${
                        cardB.color === 'red'
                          ? 'border-rose-300 text-rose-600'
                          : 'border-slate-800 text-slate-900'
                      }`}
                    >
                      <div className="flex flex-col leading-none font-rubik font-black">
                        <span className="text-2xl">{cardB.displayRank}</span>
                        <span className="text-xl">{cardB.suit}</span>
                      </div>
                      <div className="text-center font-rubik text-4xl font-black">{cardB.suit}</div>
                      <div className="flex flex-col items-end leading-none font-rubik font-black rotate-180">
                        <span className="text-2xl">{cardB.displayRank}</span>
                        <span className="text-xl">{cardB.suit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fox Team Buzzer (Orange) */}
                  <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleBuzz('fox')}
                      className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center shadow-xl transition-all bubbly-button ${
                        buzzedTeam === 'fox'
                          ? 'bg-amber-500 border-amber-300 text-white scale-110 ring-4 ring-amber-300 animate-pulse'
                          : 'bg-gradient-to-b from-amber-500 to-amber-600 border-amber-300 text-white hover:brightness-110'
                      }`}
                      type="button"
                    >
                      <span className="text-4xl">🦊</span>
                      <span className="font-rubik text-base font-black mt-1">FOX SLAP</span>
                      <span className="font-jakarta text-[11px] font-bold opacity-90">[Press L]</span>
                    </button>
                    <span className="font-rubik text-lg text-amber-950 font-black">Score: {foxScore}</span>
                  </div>
                </div>

                {/* Buzzer Alert Notification */}
                {buzzedTeam ? (
                  <div className="w-full bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{buzzedTeam === 'bear' ? '🐻' : '🦊'}</span>
                      <div>
                        <div className="font-rubik text-lg text-stone-900 font-black">
                          {buzzedTeam === 'bear' ? 'Bear Team Buzzed In!' : 'Fox Team Buzzed In!'}
                        </div>
                        <div className="font-jakarta text-xs text-stone-600 font-bold">
                          Shout your answer out loud right now!
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => awardPoint(buzzedTeam)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-jakarta text-xs font-black border-2 border-emerald-600 shadow-md bubbly-button"
                        type="button"
                      >
                        Correct! (+1 Pt) 🎉
                      </button>
                      <button
                        onClick={() => {
                          playBuzzer(sfxEnabled);
                          setBuzzedTeam(null);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-100 text-rose-800 font-jakarta text-xs font-bold border border-rose-300 hover:bg-rose-200 transition-colors"
                        type="button"
                      >
                        Pass / Wrong ❌
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={dealNewDuel}
                      className="px-6 py-3 rounded-2xl bg-sky-500 text-white font-jakarta text-sm font-black border-2 border-sky-600 shadow-md bubbly-button"
                      type="button"
                    >
                      🃏 Deal New Hand!
                    </button>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="px-4 py-3 rounded-2xl bg-sky-50 text-sky-900 font-jakarta text-sm font-bold border border-sky-200 hover:bg-sky-100 transition-colors"
                      type="button"
                    >
                      {showSolution ? 'Hide Math Secret' : 'Reveal Answer 🔍'}
                    </button>
                  </div>
                )}

                {/* Tactile Candy Marbles Proof & Solution */}
                {showSolution && (
                  <div className="w-full bg-gradient-to-r from-sky-50 to-amber-50 rounded-2xl p-5 border-2 border-sky-200 flex flex-col gap-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-jakarta text-xs text-sky-800 font-extrabold uppercase">
                        Math Verification &amp; Visual Representation
                      </span>
                      <span className="font-rubik text-xl text-sky-950 font-black">
                        {cardA.rank} {duelType === 'addition' ? '+' : '×'} {cardB.rank} = {expectedAnswer} 🍬
                      </span>
                    </div>

                    {/* Interactive Marbles Array for Addition */}
                    {duelType === 'addition' && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-200/60">
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from({ length: cardA.rank }).map((_, i) => (
                            <div
                              key={`ma-${i}`}
                              className="w-7 h-7 rounded-full bg-sky-400 border border-sky-600 shadow-sm flex items-center justify-center text-[11px] font-bold text-white hover:scale-125 transition-transform cursor-pointer"
                              title={`Marble ${i + 1}`}
                            >
                              🔵
                            </div>
                          ))}
                        </div>
                        <span className="font-rubik text-lg font-black text-amber-700 px-2">+</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from({ length: cardB.rank }).map((_, i) => (
                            <div
                              key={`mb-${i}`}
                              className="w-7 h-7 rounded-full bg-amber-400 border border-amber-600 shadow-sm flex items-center justify-center text-[11px] font-bold text-white hover:scale-125 transition-transform cursor-pointer"
                              title={`Marble ${i + 1}`}
                            >
                              🟠
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* TARGET QUEST MODE: 4-Card Sandbox */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-200 shadow-md flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-jakarta text-xs text-sky-700 font-extrabold uppercase tracking-wider block">
                      Target Quest Strategy Workspace
                    </span>
                    <h2 className="font-rubik text-2xl text-stone-900 font-black mt-1">
                      Hit Exactly: <span className="text-rose-600 underline">{targetGoal}</span> 🎯
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-jakarta text-xs text-stone-600 font-bold">Goal:</span>
                    {[10, 20, 24].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => { playPop(sfxEnabled); setTargetGoal(goal); }}
                        className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-black transition-all ${
                          targetGoal === goal
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                    <button
                      onClick={dealNewTargetHand}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-jakarta text-xs font-black shadow-sm bubbly-button ml-2"
                      type="button"
                    >
                      🎲 Deal 4 Cards
                    </button>
                  </div>
                </div>

                {/* 4 Hand Cards */}
                <div>
                  <div className="font-jakarta text-xs text-stone-600 font-bold mb-2">
                    Your 4 Available Cards (Tap to add into your math equation):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {targetHand.map((c, i) => (
                      <button
                        key={c.id + i}
                        onClick={() => addToken(c.rank.toString())}
                        className={`h-24 bg-white border-2 rounded-2xl p-2 flex flex-col justify-between shadow-sm hover:scale-105 transition-transform bubbly-button ${
                          c.color === 'red' ? 'border-rose-300 text-rose-600' : 'border-slate-700 text-slate-900'
                        }`}
                        type="button"
                      >
                        <div className="flex justify-between items-center font-rubik font-black text-sm">
                          <span>{c.displayRank}</span>
                          <span>{c.suit}</span>
                        </div>
                        <div className="text-center font-rubik text-2xl font-black">{c.rank}</div>
                        <div className="text-right text-[10px] text-stone-400 font-bold">Use Card</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operator Toolbox */}
                <div>
                  <div className="font-jakarta text-xs text-stone-600 font-bold mb-2">
                    Math Operators &amp; Parentheses:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['+', '−', '×', '÷', '(', ')'].map((op) => (
                      <button
                        key={op}
                        onClick={() => addToken(op === '−' ? '-' : op)}
                        className="w-12 h-12 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-rubik text-xl font-black border border-sky-300 shadow-sm bubbly-button flex items-center justify-center"
                        type="button"
                      >
                        {op}
                      </button>
                    ))}
                    <button
                      onClick={removeLastToken}
                      className="px-4 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-jakarta text-xs font-bold border border-stone-300"
                      type="button"
                    >
                      ⌫ Backspace
                    </button>
                    <button
                      onClick={clearEquation}
                      className="px-4 h-12 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-jakarta text-xs font-bold border border-rose-200"
                      type="button"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Equation Slot */}
                <div className="p-4 bg-sky-50/60 rounded-2xl border-2 border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 min-h-[3rem] bg-white rounded-xl border border-sky-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
                    <span className="font-jakarta text-xs text-stone-400 select-none">Equation:</span>
                    <span className="font-rubik text-lg text-sky-950 font-black tracking-wider">
                      {equationTokens.length > 0 ? equationTokens.join(' ') : 'Click cards & operators above...'}
                    </span>
                  </div>
                  <button
                    onClick={evaluateTarget}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-jakarta text-sm font-black border-2 border-emerald-600 shadow-md bubbly-button shrink-0"
                    type="button"
                  >
                    Test Solution! 🚀
                  </button>
                </div>

                {/* Feedback Banner */}
                {targetFeedback && (
                  <div
                    className={`p-4 rounded-2xl border-2 font-jakarta text-xs font-black ${
                      targetFeedback.success
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                        : 'bg-rose-100 border-rose-400 text-rose-950'
                    }`}
                  >
                    {targetFeedback.msg}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Scoreboard & Educational Framework */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Duel Scoreboard */}
            <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-rubik text-base text-stone-900 font-black flex items-center gap-2">
                  <span>🏆</span> Arcade Scoreboard
                </span>
                <button
                  onClick={() => {
                    playPop(sfxEnabled);
                    setBearScore(0);
                    setFoxScore(0);
                    setDuelHistory([]);
                  }}
                  className="font-jakarta text-[11px] text-stone-500 hover:text-stone-800"
                >
                  Reset Scores
                </button>
              </div>

              {/* Teams breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 text-center flex flex-col items-center">
                  <span className="text-3xl mb-1">🐻</span>
                  <span className="font-rubik text-sm text-sky-900 font-bold">Bear Team</span>
                  <span className="font-rubik text-3xl text-sky-950 font-black my-1">{bearScore}</span>
                  <button
                    onClick={() => { playSuccess(sfxEnabled); setBearScore((prev) => prev + 1); }}
                    className="w-full mt-1 py-1 bg-sky-200 hover:bg-sky-300 text-sky-900 font-jakarta text-xs font-black rounded-lg"
                  >
                    +1 Point
                  </button>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center flex flex-col items-center">
                  <span className="text-3xl mb-1">🦊</span>
                  <span className="font-rubik text-sm text-amber-900 font-bold">Fox Team</span>
                  <span className="font-rubik text-3xl text-amber-950 font-black my-1">{foxScore}</span>
                  <button
                    onClick={() => { playSuccess(sfxEnabled); setFoxScore((prev) => prev + 1); }}
                    className="w-full mt-1 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-jakarta text-xs font-black rounded-lg"
                  >
                    +1 Point
                  </button>
                </div>
              </div>

              {/* Recent rounds feed */}
              <div>
                <span className="font-jakarta text-xs text-stone-500 font-bold block mb-1">Round Log:</span>
                <div className="space-y-1 text-xs font-jakarta text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200 min-h-[4rem]">
                  {duelHistory.length > 0 ? (
                    duelHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span>•</span>
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-stone-400 italic">No rounds played yet. Slap a buzzer!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Offline Card Deck Rules Reference */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <span className="font-rubik text-sm text-amber-950 font-black">
                  Physical Deck Quick Rules
                </span>
              </div>
              <ul className="space-y-2 font-jakarta text-xs text-amber-900 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-black">1.</span>
                  <span><strong>Remove Face Cards:</strong> Take out Kings, Queens &amp; Jacks.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-black">2.</span>
                  <span><strong>Aces Count as 1:</strong> Keep all 2 through 10 in play.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-black">3.</span>
                  <span><strong>War Tie-Breaker:</strong> If answers match, flip 2 more cards for a 4-card super showdown!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
