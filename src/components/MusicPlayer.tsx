import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnd = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-sm glass rounded-2xl p-6 relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnd}
      />
      
      {/* Visualizer Mock */}
      <div className="flex items-end gap-1 h-12 mb-6 justify-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [10, 40, 15, 35, 10] : 10
            }}
            transition={{
              duration: 1 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 rounded-full"
            style={{ backgroundColor: currentTrack.color }}
          ></motion.div>
        ))}
      </div>

      <div className="text-center mb-6">
        <motion.h3 
          key={currentTrack.title}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold tracking-tight mb-1"
        >
          {currentTrack.title}
        </motion.h3>
        <p className="text-slate-400 text-sm font-mono">{currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1 bg-slate-800 rounded-full mb-8">
        <div 
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          style={{ 
            width: `${progress}%`,
            backgroundColor: currentTrack.color 
          }}
        ></div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          id="prev-track"
          onClick={prevTrack} 
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <SkipBack size={24} />
        </button>

        <button
          id="play-pause"
          onClick={togglePlay}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ 
            backgroundColor: currentTrack.color,
            boxShadow: `0 0 20px ${currentTrack.color}66`
          }}
        >
          {isPlaying ? (
            <Pause size={28} className="text-slate-950 fill-slate-950" />
          ) : (
            <Play size={28} className="text-slate-950 fill-slate-950 ml-1" />
          )}
        </button>

        <button 
          id="next-track"
          onClick={nextTrack} 
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Backdrop Glow */}
      <div 
        className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      ></div>
    </div>
  );
}
