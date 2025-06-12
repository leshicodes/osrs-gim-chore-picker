import { useState, useRef, useEffect } from 'react';
import type { Chore } from '../types';
import './ChoreWheel.css';

// OSRS-style sound effect URLs
const SPIN_SOUND_URL = 'https://vgmsite.com/soundtracks/old-school-runescape/wcobbfzc/Enchant%20Glass.mp3';
const RESULT_SOUND_URL = 'https://vgmsite.com/soundtracks/old-school-runescape/jvponxgf/Level%20Up.mp3';

interface ChoreWheelProps {
  chores: Chore[];
  onSpinEnd: () => void;
}

const ChoreWheel: React.FC<ChoreWheelProps> = ({ chores, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const resultSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize sound effects
  useEffect(() => {
    spinSoundRef.current = new Audio(SPIN_SOUND_URL);
    resultSoundRef.current = new Audio(RESULT_SOUND_URL);
    
    // Preload sounds
    spinSoundRef.current.load();
    resultSoundRef.current.load();
    
    return () => {
      // Clean up audio resources
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current = null;
      }
      if (resultSoundRef.current) {
        resultSoundRef.current.pause();
        resultSoundRef.current = null;
      }
    };
  }, []);
    const spinWheel = () => {
    if (isSpinning || chores.length === 0) return;

    setIsSpinning(true);
    
    // Play OSRS-style spin sound effect
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(e => console.log('Audio playback error:', e));
    }

    // Just select a random index for animation purposes only
    // The actual chore will be selected by getRandomChore in the App component
    const randomIndex = Math.floor(Math.random() * chores.length);

    // Calculate the rotation to land on that chore
    const segmentAngle = 360 / chores.length;
    const segmentRotation = segmentAngle * randomIndex;

    // Add variability to the number of rotations for more dynamic animations
    // Between 5 and 7 full rotations for an authentic OSRS random feel
    const rotations = 5 + Math.random() * 2;
    
    // Ensure we rotate at least 5 full rotations plus landing on the selected segment
    const landingPosition = 360 - segmentRotation + (segmentAngle / 2);    // Always start from 0 to ensure consistent behavior
    const baseRotation = 0;
    const newRotation = baseRotation + (360 * rotations) + landingPosition;

    console.log('Spinning wheel to rotation: ', newRotation);
    setRotation(newRotation);
    
    // Wait for animation to complete before calling onSpinEnd
    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd();
      
      // Play OSRS-style result sound when wheel stops
      if (resultSoundRef.current) {
        resultSoundRef.current.currentTime = 0;
        resultSoundRef.current.play().catch(e => console.log('Audio playback error:', e));
      }
    }, 5000); // This should match the CSS transition duration
  };

  // Reset the wheel after an excessive number of spins to prevent extreme values
  useEffect(() => {
    if (rotation > 3600 && !isSpinning) {
      console.log('Resetting wheel rotation from', rotation, 'to', rotation % 360);
      setRotation(rotation % 360);
    }
  }, [rotation, isSpinning]);
  // Helper function to determine optimal text visibility settings based on chore count
  const getSegmentStyles = (chore: Chore, index: number, totalChores: number) => {
    const segmentAngle = 360 / totalChores;
    const rotateAngle = index * segmentAngle;
    const skewAngle = 90 - segmentAngle;

    // Calculate gradient background based on chore type
    let backgroundColor;
    let typeIcon = '';
      // Add type-specific OSRS-styled icon
    if (chore.type === 'afk') {
      backgroundColor = `linear-gradient(135deg, #2E7D32 0%, #1b5e20 100%)`;
      typeIcon = '🛡️'; // Shield for AFK activities - Defense icon in OSRS
    } else if (chore.type === 'gathering') {
      backgroundColor = `linear-gradient(135deg, #1565C0 0%, #0d47a1 100%)`;
      typeIcon = '⛏️'; // Pickaxe for gathering - Mining icon in OSRS
    } else if (chore.type === 'boss') {
      backgroundColor = `linear-gradient(135deg, #C62828 0%, #b71c1c 100%)`;
      typeIcon = '☠️'; // Skull and crossbones for bosses - More OSRS-like danger symbol
    } else {
      backgroundColor = `linear-gradient(135deg, #E67700 0%, #d84315 100%)`;
      typeIcon = '⚔️'; // Crossed swords for other activities - Combat icon in OSRS
    }

    // Calculate padding based on number of segments
    const paddingBottom = totalChores <= 6 ? '45%' : 
                        totalChores <= 8 ? '55%' : 
                        totalChores <= 12 ? '65%' : '72%';

    // Calculate additional text-shadow intensity based on number of segments
    const textShadowIntensity = totalChores <= 8 ? '0 0 4px rgba(0,0,0,0.9)' : 
                                totalChores <= 12 ? '0 0 6px rgba(0,0,0,1)' :
                                '0 0 8px rgba(0,0,0,1), 0 0 4px #000';    return {
      segment: {
        transform: `rotate(${rotateAngle}deg) skewY(${skewAngle}deg)`,
        background: backgroundColor,
        backgroundSize: '200% 200%',
        width: '50%',
      },      text: {
        transform: `skewY(${-skewAngle}deg) rotate(${segmentAngle / 2}deg)`,
        transformOrigin: 'bottom center',
        paddingBottom,
        textShadow: `-1px -1px 0 #000, 
                      1px -1px 0 #000,
                     -1px 1px 0 #000,
                      1px 1px 0 #000,
                      ${textShadowIntensity},
                      0 0 2px #fff`,
        WebkitTextStroke: totalChores > 10 ? '0.5px black' : undefined,
        // Add CSS variables for the hover effect
        '--skew-angle': `${-skewAngle}deg`,
        '--rotate-angle': `${segmentAngle / 2}deg`
      },
      typeIcon: typeIcon
    };
  };  // Sound volume control
  const setVolume = (volume: number) => {
    if (spinSoundRef.current) spinSoundRef.current.volume = volume;
    if (resultSoundRef.current) resultSoundRef.current.volume = volume;
  };  return (
    <div className={`wheel-container ${isSpinning ? 'container-spinning' : ''}`}>
      <div className="wheel-container-corner-decorations"></div>
      <div className="wheel-container-title">
        <span className="title-rune">❆</span> 
        Quest Wheel 
        <span className="title-rune">❆</span>
      </div>
      <div className="sound-controls">
        <button 
          className="sound-button" 
          onClick={() => setVolume(0)}
          title="Mute sounds"
        >
          🔇
        </button>
        <button 
          className="sound-button" 
          onClick={() => setVolume(0.5)}
          title="Medium volume"
        >
          🔉
        </button>
        <button 
          className="sound-button" 
          onClick={() => setVolume(1)}
          title="Full volume"
        >
          🔊
        </button>
      </div>
      <div className="wheel-pointer"></div>
      <div 
        ref={wheelRef}
        className={`wheel ${isSpinning ? 'spinning' : ''}`} 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {chores.map((chore, index) => {
          const styles = getSegmentStyles(chore, index, chores.length);

          return (
            <div 
              key={index}
              className="wheel-segment" 
              style={styles.segment}
            >              <span 
                className="segment-text"
                style={styles.text}
              >
                {/* Type icon followed by text */}
                <span className="segment-type-icon">{styles.typeIcon}</span>
                {/* Truncate text differently based on segment count for better readability */}
                {chore.name.length > 15 && chores.length > 8 
                  ? `${chore.name.substring(0, 8)}...` 
                  : chore.name.length > 20
                    ? `${chore.name.substring(0, 16)}...`
                    : chore.name}
              </span>
            </div>
          );
        })}
      </div>
        <button 
        className="spin-button"
        onClick={spinWheel}
        disabled={isSpinning || chores.length === 0}
      >
        <span>
          {isSpinning ? 'Casting...' : '⚔️ Cast Wheel of Fate! ⚔️'}
        </span>
      </button>
    </div>
  );
};

export default ChoreWheel;
