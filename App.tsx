import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WAVE_CHARS, BG_CHARS, COLOR_MAP } from './constants';
import HomePage from './HomePage';

const GridAnimationStyles = () => (
  <style>{`
    @keyframes fadeWave {
      0%   { opacity: 0.1; transform: scale(0.9); }
      50%  { opacity: 1; transform: scale(1.1); }
      100% { opacity: 0.1; transform: scale(0.9); }
    }
    .cell-animation {
      animation: fadeWave 3s infinite ease-in-out;
      /* The delay is set via a CSS custom property */
      animation-delay: var(--animation-delay);
    }
  `}</style>
);

// Interface for a single component of the wave
interface WaveComponent {
  amplitude: number;
  frequency: number;
  phase: number;
  phaseSpeed: number;
}

const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};


function App() {
  const { width, height } = useWindowSize();
  const [time, setTime] = useState(0);

  const { COLS, ROWS, TOTAL_CELLS } = useMemo(() => {
    if (width === 0 || height === 0) return { COLS: 0, ROWS: 0, TOTAL_CELLS: 0 };

    const CELL_APPROX_SIZE = 32; // font size + padding + gap
    const CONTAINER_PADDING = 20; // p-[10px] -> 10px on each side

    const topOffset = Math.max(0, (height / 2) - 250);
    const availableHeight = height - topOffset - CONTAINER_PADDING;
    const availableWidth = width - CONTAINER_PADDING;
    
    const COLS = Math.floor(availableWidth / CELL_APPROX_SIZE);
    const ROWS = Math.floor(availableHeight / CELL_APPROX_SIZE);
    
    if (COLS <= 0 || ROWS <= 0) return { COLS: 0, ROWS: 0, TOTAL_CELLS: 0 };
    
    const TOTAL_CELLS = COLS * ROWS;

    return { COLS, ROWS, TOTAL_CELLS };
  }, [width, height]);


  // Wave parameters are stored in a ref to be mutated without causing re-renders
  const waveParamsRef = useRef<WaveComponent[]>(
    Array.from({ length: 3 }).map(() => ({
      amplitude: Math.random() * 1.5 + 0.5, // range: 0.5 to 2.0
      frequency: Math.random() * 0.2 + 0.1, // range: 0.1 to 0.3
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: (Math.random() - 0.5) * 0.001, // slow evolution speed
    }))
  );

  // Generate a stable set of background characters, re-generated on resize.
  const backgroundChars = useMemo(() => {
    if (TOTAL_CELLS === 0) return [];
    return Array.from({ length: TOTAL_CELLS }, () => BG_CHARS[Math.floor(Math.random() * BG_CHARS.length)]);
  }, [TOTAL_CELLS]);


  // Effect to update time and wave parameters using requestAnimationFrame.
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      // Evolve wave parameters for a fluid, changing shape
      waveParamsRef.current.forEach(p => {
        p.phase += p.phaseSpeed;
      });

      // Time drives the wave's forward motion
      setTime(t => t + 16); // ~60fps increment
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    // Cleanup function to cancel the animation frame when the component unmounts.
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Return a loading state or nothing if grid dimensions are not calculated yet.
  if (TOTAL_CELLS === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#0e0e0e] antialiased">
        {/* Empty while calculating dimensions */}
      </main>
    );
  }

  // Calculate delays for each cell on every render to create a fluid wave.
  const cellDelays = Array.from({ length: TOTAL_CELLS }).map((_, i) => {
    const x = i % COLS;
    const y = Math.floor(i / COLS);

    // The wave's main progression is now diagonal by combining x and y coordinates.
    const baseProgression = (x + y) * 0.05;

    // The curve is a sum of multiple, evolving sine waves.
    const curveOffset = waveParamsRef.current.reduce((acc, params) => {
      const { amplitude, frequency, phase } = params;
      // Using a mix of x and y for the curve makes it more dynamic with the diagonal wave
      return acc + Math.sin((y + x * 0.5) * frequency + phase) * amplitude;
    }, 0);

    // Combine the base progression with the curve to get the final delay.
    return baseProgression + curveOffset;
  });


  // Calculate characters for each cell on every render based on the current time.
  const cells = cellDelays.map((delay, i) => {
    // Calculate the animation phase for the cell (0 to 1). The animation duration is 3000ms.
    const phase = ((time / 3000) + (delay / 3)) % 1;

    const waveCrestStart = 0.4;
    const waveCrestEnd = 0.6;

    // Determine if the cell is in the "crest" of the wave.
    if (phase > waveCrestStart && phase < waveCrestEnd) {
      // Inside the wave crest, map the phase to a character from WAVE_CHARS.
      const wavePhase = (phase - waveCrestStart) / (waveCrestEnd - waveCrestStart);
      const charIndex = Math.floor(wavePhase * WAVE_CHARS.length);
      return WAVE_CHARS[charIndex];
    } else {
      // Outside the crest, show the static background character.
      return backgroundChars[i];
    }
  });

  return (
    <>
      <GridAnimationStyles />
      {/* Wave animation as fixed/absolute background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <main className="min-h-screen bg-[#0e0e0e] antialiased overflow-hidden">
          <div className="absolute top-[max(0px,calc(50vh-250px))] left-0 right-0 bottom-0 p-[10px] bg-[#1a1a1a] box-border shadow-2xl shadow-cyan-500/10 z-0">
            <div className={`grid h-full w-full gap-[10px] grid-cols-[repeat(${COLS},minmax(0,1fr))] grid-rows-[repeat(${ROWS},minmax(0,1fr))]`}>
              {cells.map((char, i) => {
                const delay = cellDelays[i]; // Use dynamically calculated delay
                const colorClass = COLOR_MAP[char] || 'text-slate-600';
                
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center w-full h-full font-mono text-base rounded-sm opacity-0 cell-animation ${colorClass}`}
                    style={{ '--animation-delay': `${delay}s` } as React.CSSProperties}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      {/* HomePage content in normal flow, scrollable */}
      <div className="relative z-10 px-2 pb-8">
        <HomePage />
      </div>
    </>
  );
}

export default App;
