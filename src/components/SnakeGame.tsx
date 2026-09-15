import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

// Grid configuration
const COLS = 30;
const ROWS = 15;
const SPEED = 100;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize / Reset Game
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood({ x: 15, y: 5 });
    setDirection('UP');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  // Generate random food
  const spawnFood = useCallback(() => {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    setFood({ x, y });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Exit
      if (e.key === 'Escape') {
         // Dispatch custom event for Hero to catch if needed, or we handle via props later.
         // For now, let's rely on Hero passing an onExit prop or handling the key globally?
         // Actually, simpler to just let the parent handle the keydown if it's bubbling, 
         // BUT we are stopping propagation in some cases. 
         // Let's NOT preventDefault on Escape so it bubbles up.
         return; 
      }

      // Handle Game Over / Start interactions
      if (!isPlaying || gameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          resetGame();
          e.preventDefault();
        }
        return;
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check collisions (walls)
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collisions (self)
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          spawnFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(moveSnake);
  }, [direction, food, gameOver, isPlaying, spawnFood]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-mono text-[#1a2f23]">
      
      {/* Game Header */}
      <div className="w-full flex justify-between items-center mb-4 px-2 border-b-2 border-[#1a2f23]/20 pb-2">
         <span className="text-[10px] font-bold tracking-widest uppercase">SNAKE.EXE</span>
         <span className="text-[10px] font-bold tracking-widest">SCORE: {score.toString().padStart(3, '0')}</span>
      </div>

      {/* Game Board */}
      {!isPlaying && !gameOver ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <span className="text-xl font-bold tracking-wider">READY PLAYER ONE</span>
           <button 
             onClick={resetGame}
             className="px-4 py-2 border-2 border-[#1a2f23] text-xs font-bold hover:bg-[#1a2f23] hover:text-[#8aa899] transition-colors uppercase tracking-widest"
           >
             Start Game
           </button>
        </div>
      ) : gameOver ? (
        <div className="flex flex-col items-center gap-4">
           <span className="text-xl font-bold tracking-wider">GAME OVER</span>
           <span className="text-xs font-bold">FINAL SCORE: {score}</span>
           <button 
             onClick={resetGame}
             className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a2f23] text-xs font-bold hover:bg-[#1a2f23] hover:text-[#8aa899] transition-colors uppercase tracking-widest"
           >
             <RefreshCw size={14} /> Retry
           </button>
        </div>
      ) : (
        <div 
          className="relative border-2 border-[#1a2f23]/20 bg-[#1a2f23]/5"
          style={{
            width: `${COLS * 10}px`,
            height: `${ROWS * 10}px`
          }}
        >
           {/* Snake */}
           {snake.map((segment, i) => (
             <div 
               key={i}
               className="absolute bg-[#1a2f23]"
               style={{
                 left: `${segment.x * 10}px`,
                 top: `${segment.y * 10}px`,
                 width: '10px',
                 height: '10px',
                 borderRadius: '1px'
               }}
             />
           ))}
           {/* Food */}
           <div 
             className="absolute bg-[#1a2f23]"
             style={{
               left: `${food.x * 10}px`,
               top: `${food.y * 10}px`,
               width: '8px',
               height: '8px',
               margin: '1px',
               borderRadius: '50%'
             }}
           />
        </div>
      )}

      {/* Footer Instructions */}
      <div className="mt-auto w-full text-center pt-4 opacity-50 text-[8px] font-bold tracking-widest">
         USE ARROW KEYS TO MOVE
      </div>
    </div>
  );
};
