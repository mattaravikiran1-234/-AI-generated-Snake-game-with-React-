import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, TICK_RATE } from '../constants';

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Space to pause/start
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check self-collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#39ff14'; // lime
    ctx.fillStyle = '#39ff14';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, i) => {
      const alpha = 1 - (i / snake.length) * 0.5;
      ctx.shadowBlur = i === 0 ? 20 : 10;
      ctx.shadowColor = '#00f5ff'; // cyan
      ctx.fillStyle = `rgba(0, 245, 255, ${alpha})`;
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-lime rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative glass p-4 rounded-xl">
        <canvas
          id="snake-canvas"
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-sm cursor-none"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl z-10"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-bold text-neon-magenta mb-4 tracking-tighter">GAME OVER</h2>
                  <p className="text-slate-400 font-mono mb-8">FINAL SCORE: {score}</p>
                  <button
                    id="restart-button"
                    onClick={resetGame}
                    className="px-8 py-3 bg-neon-cyan text-slate-950 font-bold rounded-full neon-shadow-cyan hover:scale-105 transition-transform"
                  >
                    PLAY AGAIN
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-neon-cyan mb-4 tracking-tighter">PAUSED</h2>
                  <p className="text-slate-400 font-mono mb-8 italic">Press SPACE to pulse</p>
                  <button
                    id="resume-button"
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-neon-cyan text-slate-950 font-bold rounded-full neon-shadow-cyan hover:scale-105 transition-transform"
                  >
                    RESUME
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
