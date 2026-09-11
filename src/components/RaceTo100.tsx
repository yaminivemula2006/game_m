import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playPop, playDiceRoll, playSuccess, playZap } from '../utils/audio';

interface RaceTo100Props {
  sfxEnabled: boolean;
}

interface PlayerState {
  id: string;
  name: string;
  team: string;
  emoji: string;
  color: string;
  rounds: { roll: [number, number]; chosen: number; total: number }[];
  currentTotal: number;
}

export const RaceTo100: React.FC<RaceTo100Props> = ({ sfxEnabled }) => {
  const [targetMax, setTargetMax] = useState<50 | 100>(100);

  // Dice State
  const [die1, setDie1] = useState<number>(3);
  const [die2, setDie2] = useState<number>(5);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(true);

  // 2 Players
  const [activePlayerIndex, setActivePlayerIndex] = useState<0 | 1>(0);
  const [players, setPlayers] = useState<[PlayerState, PlayerState]>([
    {
      id: 'p1',
      name: 'Player 1',
      team: 'Rocket Team',
      emoji: '🚀',
      color: 'sky',
      rounds: [],
      currentTotal: 0
    },
    {
      id: 'p2',
      name: 'Player 2',
      team: 'Comet Team',
      emoji: '☄️',
      color: 'amber',
      rounds: [],
      currentTotal: 0
    }
  ]);

  const [winnerModal, setWinnerModal] = useState<{
    winner: PlayerState;
    runnerUp: PlayerState;
    reason: string;
  } | null>(null);

  // Roll Dice
  const handleRollDice = () => {
    if (isRolling) return;
    playDiceRoll(sfxEnabled);
    setIsRolling(true);
    setHasRolled(false);

    let count = 0;
    const interval = setInterval(() => {
      setDie1(Math.floor(Math.random() * 6) + 1);
      setDie2(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const final1 = Math.floor(Math.random() * 6) + 1;
        const final2 = Math.floor(Math.random() * 6) + 1;
        setDie1(final1);
        setDie2(final2);
        setIsRolling(false);
        setHasRolled(true);
      }
    }, 60);
  };

  const choiceA = die1 * 10 + die2;
  const choiceB = die2 * 10 + die1;

  const activePlayer = players[activePlayerIndex];
  const newTotalA = activePlayer.currentTotal + choiceA;
  const newTotalB = activePlayer.currentTotal + choiceB;

  // Make Place Value Choice
  const handleChooseValue = (val: number) => {
    playPop(sfxEnabled);
    const newTotal = activePlayer.currentTotal + val;

    const updatedPlayers = [...players] as [PlayerState, PlayerState];
    updatedPlayers[activePlayerIndex] = {
      ...activePlayer,
      currentTotal: newTotal,
      rounds: [
        ...activePlayer.rounds,
        {
          roll: [die1, die2],
          chosen: val,
          total: newTotal
        }
      ]
    };
    setPlayers(updatedPlayers);
    setHasRolled(false);

    // Check bust or completion
    if (newTotal === targetMax) {
      playSuccess(sfxEnabled);
      try {
        confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
      } catch {
        // Fallback
      }
      setWinnerModal({
        winner: updatedPlayers[activePlayerIndex],
        runnerUp: updatedPlayers[1 - activePlayerIndex],
        reason: `Hit exactly ${targetMax} on the nose!`
      });
      return;
    }

    if (newTotal > targetMax) {
      playZap(sfxEnabled);
      // Bust! Other player wins or closest wins
      setWinnerModal({
        winner: updatedPlayers[1 - activePlayerIndex],
        runnerUp: updatedPlayers[activePlayerIndex],
        reason: `${activePlayer.name} popped the target with ${newTotal}!`
      });
      return;
    }

    // Next player's turn
    const nextIndex = (1 - activePlayerIndex) as 0 | 1;
    setActivePlayerIndex(nextIndex);
  };

  // Reset Game
  const resetGame = () => {
    playPop(sfxEnabled);
    setPlayers([
      {
        id: 'p1',
        name: 'Player 1',
        team: 'Rocket Team',
        emoji: '🚀',
        color: 'sky',
        rounds: [],
        currentTotal: 0
      },
      {
        id: 'p2',
        name: 'Player 2',
        team: 'Comet Team',
        emoji: '☄️',
        color: 'amber',
        rounds: [],
        currentTotal: 0
      }
    ]);
    setActivePlayerIndex(0);
    setDie1(3);
    setDie2(5);
    setHasRolled(true);
    setWinnerModal(null);
  };

  // Stop / Stand Option (Closest to 100 wins after both have had rounds)
  const handleStand = () => {
    playSuccess(sfxEnabled);
    const p1Dist = targetMax - players[0].currentTotal;
    const p2Dist = targetMax - players[1].currentTotal;
    let winner = players[0];
    let runnerUp = players[1];

    if (p2Dist < p1Dist) {
      winner = players[1];
      runnerUp = players[0];
    }

    setWinnerModal({
      winner,
      runnerUp,
      reason: `Closest to ${targetMax} without going over!`
    });
  };

  // Calculate bust risk radar percentage
  const dist = targetMax - activePlayer.currentTotal;
  let riskPercent = 0;
  if (dist < 20) riskPercent = 90;
  else if (dist < 40) riskPercent = 65;
  else if (dist < 60) riskPercent = 35;
  else riskPercent = 5;

  return (
    <div className="flex flex-col w-full">
      {/* Target Settings & Player Turn Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-4">
        <div className="bg-gradient-to-r from-amber-100/90 via-orange-100/70 to-yellow-100/80 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200/90 text-amber-950 font-jakarta font-black mb-2 text-xs uppercase tracking-wider">
              <span>🎲 2 DICE + DOODLE PAPER</span>
              <span>•</span>
              <span>⭐ Ages 6–12</span>
              <span>•</span>
              <span>🚀 2-Digit Mental Adds</span>
            </div>
            <h1 className="font-rubik text-3xl sm:text-4xl text-stone-900 font-black flex items-center gap-2">
              Race to {targetMax} • Close to {targetMax}! <span className="text-amber-500">🎲✨</span>
            </h1>
            <p className="mt-2 font-jakarta text-sm sm:text-base text-stone-700 font-medium max-w-2xl">
              Roll 2 dice. Compose a 2-digit number (Tens + Ones). Add to your running trail. Get as close as you dare without busting!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {/* Target Mode 50 or 100 */}
            <div className="flex p-1 bg-white/90 rounded-2xl border-2 border-amber-300 shadow-sm">
              <button
                onClick={() => { playPop(sfxEnabled); setTargetMax(50); resetGame(); }}
                className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-black transition-all ${
                  targetMax === 50 ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-700 hover:text-amber-900'
                }`}
              >
                Race to 50 ⚡
              </button>
              <button
                onClick={() => { playPop(sfxEnabled); setTargetMax(100); resetGame(); }}
                className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-black transition-all ${
                  targetMax === 100 ? 'bg-amber-500 text-white shadow-sm' : 'text-stone-700 hover:text-amber-900'
                }`}
              >
                Close to 100 🎯
              </button>
            </div>

            <button
              onClick={resetGame}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-amber-300 text-amber-900 font-jakarta text-xs font-black hover:bg-amber-100 transition-colors shadow-sm"
              type="button"
            >
              🔄 Restart Match
            </button>
          </div>
        </div>
      </section>

      {/* Active Turn Indicator Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-2">
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">{activePlayer.emoji}</span>
            <div>
              <span className="font-jakarta text-xs text-stone-500 font-bold uppercase tracking-wider">Current Turn:</span>
              <div className="font-rubik text-lg text-stone-900 font-black">
                {activePlayer.name} ({activePlayer.team})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-jakarta text-xs text-stone-500 font-bold block">Current Trail Total:</span>
              <span className="font-rubik text-2xl text-stone-900 font-black">{activePlayer.currentTotal} / {targetMax}</span>
            </div>
            {activePlayer.rounds.length >= 2 && (
              <button
                onClick={handleStand}
                className="px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-jakarta text-xs font-black border-2 border-amber-500 shadow-sm bubbly-button"
                type="button"
              >
                🛑 Stand &amp; Lock In ({activePlayer.currentTotal})
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Dice & Decision Stage */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Dice Stage & Choice Panel (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md flex flex-col items-center gap-6">
              {/* 3D Dice Graphic Block */}
              <div className="flex items-center justify-center gap-8 py-4">
                {/* Die 1: Sky Blue 3D Die */}
                <div
                  className={`w-24 h-24 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl border-2 border-sky-300 dice-blue-3d flex items-center justify-center font-rubik text-4xl font-black text-white select-none transition-transform ${
                    isRolling ? 'animate-spin' : '-rotate-6 hover:rotate-0'
                  }`}
                >
                  {die1}
                </div>

                <span className="font-rubik text-3xl text-amber-500 font-black">&amp;</span>

                {/* Die 2: Sunshine Orange 3D Die */}
                <div
                  className={`w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl border-2 border-orange-300 dice-orange-3d flex items-center justify-center font-rubik text-4xl font-black text-white select-none transition-transform ${
                    isRolling ? 'animate-spin' : 'rotate-6 hover:rotate-0'
                  }`}
                >
                  {die2}
                </div>
              </div>

              {/* Roll Button */}
              <button
                onClick={handleRollDice}
                disabled={isRolling}
                className="w-full max-w-xs h-14 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-jakarta text-base font-black border-2 border-amber-600 shadow-lg bubbly-button flex items-center justify-center gap-2"
                type="button"
              >
                <span className="text-xl">🎲</span>
                {isRolling ? 'Rolling Dice...' : 'Roll the Magic Dice!'}
              </button>

              {/* Place Value Decision Cards (Choice A vs Choice B) */}
              {hasRolled && !isRolling && (
                <div className="w-full flex flex-col gap-3 pt-4 border-t-2 border-amber-100">
                  <div className="text-center font-jakarta text-xs text-stone-600 font-bold uppercase tracking-wider">
                    Place Value Decision: Tens Digit + Ones Digit
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Choice A */}
                    <button
                      onClick={() => handleChooseValue(choiceA)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all bubbly-button ${
                        newTotalA > targetMax
                          ? 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100'
                          : 'bg-sky-50 border-sky-300 text-sky-950 hover:bg-sky-100'
                      }`}
                      type="button"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-jakarta text-xs font-black uppercase tracking-wider text-sky-700">
                          Option 1
                        </span>
                        <span className="font-rubik text-2xl font-black text-sky-900">{choiceA}</span>
                      </div>
                      <div className="font-jakarta text-xs text-stone-600">
                        {die1} Tens ({die1 * 10}) + {die2} Ones ({die2})
                      </div>
                      <div className="mt-2 pt-2 border-t border-sky-200 font-jakarta text-xs font-black flex justify-between">
                        <span>New Total:</span>
                        <span className={newTotalA > targetMax ? 'text-rose-600' : 'text-emerald-700'}>
                          {newTotalA} {newTotalA > targetMax ? '⚠️ BUST!' : '🎯'}
                        </span>
                      </div>
                    </button>

                    {/* Choice B */}
                    <button
                      onClick={() => handleChooseValue(choiceB)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all bubbly-button ${
                        newTotalB > targetMax
                          ? 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100'
                          : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                      }`}
                      type="button"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-jakarta text-xs font-black uppercase tracking-wider text-amber-700">
                          Option 2
                        </span>
                        <span className="font-rubik text-2xl font-black text-amber-900">{choiceB}</span>
                      </div>
                      <div className="font-jakarta text-xs text-stone-600">
                        {die2} Tens ({die2 * 10}) + {die1} Ones ({die1})
                      </div>
                      <div className="mt-2 pt-2 border-t border-amber-200 font-jakarta text-xs font-black flex justify-between">
                        <span>New Total:</span>
                        <span className={newTotalB > targetMax ? 'text-rose-600' : 'text-emerald-700'}>
                          {newTotalB} {newTotalB > targetMax ? '⚠️ BUST!' : '🎯'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Runway Progress & Risk Radar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Player Tracks */}
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md flex flex-col gap-5">
              <span className="font-rubik text-base text-stone-900 font-black flex items-center gap-2">
                <span>🚀</span> Runway Tracks to {targetMax}
              </span>

              {/* Player 1 Track */}
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-rubik text-sm font-black text-sky-900">
                    <span>🚀</span> Player 1 ({players[0].currentTotal} pts)
                  </div>
                  <span className="font-jakarta text-xs text-sky-700 font-bold">
                    Distance: {Math.max(0, targetMax - players[0].currentTotal)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-3.5 rounded-full overflow-hidden border border-stone-300">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (players[0].currentTotal / targetMax) * 100)}%` }}
                  ></div>
                </div>

                {/* Round history tags */}
                <div className="flex flex-wrap gap-1 text-[11px] font-bold text-sky-800 pt-1">
                  {players[0].rounds.map((r, i) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded-md border border-sky-200">
                      R{i + 1}: +{r.chosen}
                    </span>
                  ))}
                </div>
              </div>

              {/* Player 2 Track */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-rubik text-sm font-black text-amber-900">
                    <span>☄️</span> Player 2 ({players[1].currentTotal} pts)
                  </div>
                  <span className="font-jakarta text-xs text-amber-700 font-bold">
                    Distance: {Math.max(0, targetMax - players[1].currentTotal)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-3.5 rounded-full overflow-hidden border border-stone-300">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (players[1].currentTotal / targetMax) * 100)}%` }}
                  ></div>
                </div>

                {/* Round history tags */}
                <div className="flex flex-wrap gap-1 text-[11px] font-bold text-amber-800 pt-1">
                  {players[1].rounds.map((r, i) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded-md border border-amber-200">
                      R{i + 1}: +{r.chosen}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bust Risk Radar Gauge */}
            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-jakarta text-xs text-amber-950 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎯</span> Active Player Risk Radar
                </span>
                <span className="font-rubik text-xs font-black text-amber-900 bg-white/80 px-2 py-0.5 rounded-md">
                  Distance: {dist}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                  <span>Chance of Busting Next Roll:</span>
                  <span className="font-black text-amber-950">{riskPercent}%</span>
                </div>
                <div className="w-full bg-white h-3.5 rounded-full overflow-hidden border border-amber-300">
                  <div
                    className={`h-full transition-all duration-300 ${
                      riskPercent > 70 ? 'bg-rose-500' : riskPercent > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${riskPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-jakarta text-stone-700 pt-1">
                <div className="bg-white/90 p-2 rounded-xl border border-amber-200 text-center">
                  <span className="block text-[10px] text-stone-500 font-bold">Max Single Roll</span>
                  <span className="font-rubik text-sm font-black text-stone-900">66 pts (6&amp;6)</span>
                </div>
                <div className="bg-white/90 p-2 rounded-xl border border-amber-200 text-center">
                  <span className="block text-[10px] text-stone-500 font-bold">Min Single Roll</span>
                  <span className="font-rubik text-sm font-black text-stone-900">11 pts (1&amp;1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Victory Modal */}
      {winnerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border-4 border-amber-300 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center gap-4">
            <span className="text-6xl animate-bounce">🎉</span>
            <h3 className="font-rubik text-2xl text-stone-900 font-black">
              {winnerModal.winner.name} Wins!
            </h3>
            <p className="font-jakarta text-sm text-stone-600 font-medium">
              {winnerModal.reason} Final Score: {winnerModal.winner.currentTotal} / {targetMax}
            </p>
            <button
              onClick={resetGame}
              className="w-full py-3.5 rounded-2xl bg-amber-500 text-white font-jakarta text-base font-black border-2 border-amber-600 shadow-md bubbly-button"
              type="button"
            >
              Play Another Match! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
