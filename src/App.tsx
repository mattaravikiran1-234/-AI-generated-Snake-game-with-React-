/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Gamepad2, Trophy, Headphones } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <main id="main-container" className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-neon-magenta/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start relative z-10">
        {/* Left Column: Game Area */}
        <div className="flex flex-col items-center gap-6">
          <header className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-cyan/10 rounded-lg">
                <Gamepad2 className="text-neon-cyan" size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter font-mono italic">
                NEON <span className="text-neon-cyan">PULSE</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6 font-mono">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Score</span>
                <motion.span 
                  key={score}
                  initial={{ scale: 1.2, color: '#00f5ff' }}
                  animate={{ scale: 1, color: '#f8fafc' }}
                  className="text-2xl font-bold"
                >
                  {score.toString().padStart(4, '0')}
                </motion.span>
              </div>
              <div className="flex flex-col items-end opacity-60">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Best</span>
                <span className="text-2xl font-bold">{highScore.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </header>

          <SnakeGame onScoreChange={handleScoreChange} />

          <footer className="w-full max-w-[400px] flex items-center justify-center gap-8 text-[11px] text-slate-500 font-mono uppercase tracking-widest py-4 border-t border-slate-900 mt-4">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-400">ARROWS</kbd>
              <span>MOVE</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-400">SPACE</kbd>
              <span>PAUSE</span>
            </div>
          </footer>
        </div>

        {/* Right Column: Audio & Stats */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-neon-magenta/10 rounded-lg">
              <Headphones className="text-neon-magenta" size={24} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">NOW PLAYING</h2>
          </div>

          <MusicPlayer />

          <div className="glass rounded-xl p-6 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-neon-lime" size={20} />
              <h3 className="font-bold text-sm uppercase tracking-wider">Achievements</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Night Owl', value: 'Play 5 minutes', progress: 80, color: 'bg-neon-cyan' },
                { label: 'Snake Master', value: 'Score 500 points', progress: score / 5 > 100 ? 100 : score / 5, color: 'bg-neon-magenta' },
                { label: 'Glow Up', value: 'Change 3 tracks', progress: 40, color: 'bg-neon-lime' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={`h-full ${item.color}`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

