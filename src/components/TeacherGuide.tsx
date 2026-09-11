import React from 'react';
import { playPop, speakPrompt } from '../utils/audio';

interface TeacherGuideProps {
  sfxEnabled: boolean;
}

export const TeacherGuide: React.FC<TeacherGuideProps> = ({ sfxEnabled }) => {
  const handlePrint = () => {
    playPop(sfxEnabled);
    window.print();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-4">
        <div className="bg-gradient-to-r from-emerald-100/90 via-teal-100/70 to-amber-100/80 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-200/90 text-emerald-950 font-jakarta font-black mb-2 text-xs uppercase tracking-wider">
              <span>📘 EDUCATOR &amp; FAMILY COMPASS</span>
              <span>•</span>
              <span>⭐ Standards Aligned</span>
              <span>•</span>
              <span>💖 Research-Backed</span>
            </div>
            <h1 className="font-rubik text-3xl sm:text-4xl text-emerald-950 font-black flex items-center gap-2">
              Classroom &amp; Kitchen Table Guide <span className="text-amber-500">🍎✨</span>
            </h1>
            <p className="mt-2 font-jakarta text-sm sm:text-base text-stone-700 font-medium max-w-2xl">
              Everything teachers, tutors, and parents need to bridge concrete manipulatives with mental math agility. Includes printable scorecards and curriculum standards!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-jakarta text-sm font-black border-2 border-emerald-700 shadow-md bubbly-button flex items-center gap-2"
              type="button"
            >
              <span>🖨️</span> Print Educator Kit
            </button>
            <button
              onClick={() => speakPrompt('Welcome to MathVenture Kids educator guide. Math games lower affective filters, build intrinsic curiosity, and establish number sense through tactile play.')}
              className="px-4 py-3 rounded-2xl bg-white border-2 border-emerald-300 text-emerald-900 font-jakarta text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm bubbly-button flex items-center gap-2"
              type="button"
            >
              <span>🎧</span> Audio Overview
            </button>
          </div>
        </div>
      </section>

      {/* 3 Games Deep Dive Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Game 1: Guess My Number */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 text-purple-700 flex items-center justify-center text-2xl">
                🔍
              </div>
              <div>
                <span className="font-jakarta text-[11px] text-purple-700 font-black uppercase">Activity 01</span>
                <h3 className="font-rubik text-lg text-stone-900 font-black">Guess My Number</h3>
              </div>
            </div>

            <div className="space-y-2 font-jakarta text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>Mathematical Focus:</strong> Deductive logic, place-value boundaries, and parity (odd vs even).
              </p>
              <p>
                <strong>Curriculum Standards:</strong> CCSS.MATH.CONTENT.1.NBT.B.3, 2.OA.C.3.
              </p>
              <p>
                <strong>Teacher Prompt:</strong> “If you ask 'is it 14?', you only test one number. What question could eliminate half the numbers at once?”
              </p>
            </div>

            <div className="mt-auto pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-900">
              <span>Ages: 4–10</span>
              <span className="bg-purple-100 px-2 py-0.5 rounded-md">Supplies: Zero!</span>
            </div>
          </div>

          {/* Game 2: Card Duel */}
          <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <span className="font-jakarta text-[11px] text-sky-700 font-black uppercase">Activity 02</span>
                <h3 className="font-rubik text-lg text-stone-900 font-black">Make Target • Duel</h3>
              </div>
            </div>

            <div className="space-y-2 font-jakarta text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>Mathematical Focus:</strong> Mental addition automaticity, times-table fluency, and multi-step order of operations.
              </p>
              <p>
                <strong>Curriculum Standards:</strong> CCSS.MATH.CONTENT.1.OA.C.6, 3.OA.C.7.
              </p>
              <p>
                <strong>Teacher Prompt:</strong> “Notice 8 + 7: Can you decompose 7 into 2 + 5 to make 8 + 2 = 10 first?”
              </p>
            </div>

            <div className="mt-auto pt-3 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-900">
              <span>Ages: 5–12</span>
              <span className="bg-sky-100 px-2 py-0.5 rounded-md">Supplies: Card Deck</span>
            </div>
          </div>

          {/* Game 3: Race to 100 */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center text-2xl">
                🎲
              </div>
              <div>
                <span className="font-jakarta text-[11px] text-amber-700 font-black uppercase">Activity 03</span>
                <h3 className="font-rubik text-lg text-stone-900 font-black">Race to 100</h3>
              </div>
            </div>

            <div className="space-y-2 font-jakarta text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>Mathematical Focus:</strong> 2-digit place-value composition (Tens vs Ones), probability, and mental estimation.
              </p>
              <p>
                <strong>Curriculum Standards:</strong> CCSS.MATH.CONTENT.2.NBT.B.5, 3.NBT.A.2.
              </p>
              <p>
                <strong>Teacher Prompt:</strong> “You rolled a 2 and a 6. If you choose 62, your total becomes 94. What could happen on your next turn?”
              </p>
            </div>

            <div className="mt-auto pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-900">
              <span>Ages: 6–12</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded-md">Supplies: 2 Dice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Printable Scorecard Generator Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-jakarta text-xs text-emerald-700 font-black uppercase tracking-wider block">
                Classroom Printable Resource
              </span>
              <h3 className="font-rubik text-2xl text-stone-900 font-black mt-1">
                Printable Race to 100 Scorecard Template 📄
              </h3>
            </div>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-jakarta text-xs font-black border-2 border-emerald-600 shadow-sm bubbly-button"
              type="button"
            >
              Print Scorecards (4 per sheet)
            </button>
          </div>

          {/* Sample Scorecard Table */}
          <div className="overflow-x-auto bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <table className="w-full text-left font-jakarta text-xs">
              <thead>
                <tr className="border-b-2 border-stone-300 text-stone-700 font-black">
                  <th className="py-2 px-3">Round #</th>
                  <th className="py-2 px-3">Dice Rolled</th>
                  <th className="py-2 px-3">Chosen Number</th>
                  <th className="py-2 px-3">Math Calculation (Previous + Chosen)</th>
                  <th className="py-2 px-3">New Running Total</th>
                  <th className="py-2 px-3">Distance to 100</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="py-2.5 px-3 font-bold">Turn 1</td>
                  <td className="py-2.5 px-3">🎲 3 &amp; 5</td>
                  <td className="py-2.5 px-3 font-bold text-sky-700">35</td>
                  <td className="py-2.5 px-3">0 + 35</td>
                  <td className="py-2.5 px-3 font-black text-stone-900">35</td>
                  <td className="py-2.5 px-3 text-stone-500">65 away</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">Turn 2</td>
                  <td className="py-2.5 px-3">🎲 4 &amp; 2</td>
                  <td className="py-2.5 px-3 font-bold text-sky-700">42</td>
                  <td className="py-2.5 px-3">35 + 42</td>
                  <td className="py-2.5 px-3 font-black text-stone-900">77</td>
                  <td className="py-2.5 px-3 text-stone-500">23 away</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">Turn 3</td>
                  <td className="py-2.5 px-3">🎲 1 &amp; 8</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">18 (Not 81!)</td>
                  <td className="py-2.5 px-3">77 + 18</td>
                  <td className="py-2.5 px-3 font-black text-emerald-700">95 🎯</td>
                  <td className="py-2.5 px-3 font-black text-emerald-700">5 away! (Stand!)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
