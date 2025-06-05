import { useState, useRef, useEffect } from 'react';
import type { Chore } from '../types';
import './ChoreWheel.css';

interface ChoreWheelProps {
  chores: Chore[];
  onSpinEnd: (chore: Chore) => void;
}

const ChoreWheel: React.FC<ChoreWheelProps> = ({ chores, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);  const spinWheel = () => {
    if (isSpinning || chores.length === 0) return;

    setIsSpinning(true);

    // Randomly select a chore
    const randomIndex = Math.floor(Math.random() * chores.length);
    const selectedChore = chores[randomIndex];

    // Calculate the rotation to land on that chore
    const segmentAngle = 360 / chores.length;
    const segmentRotation = segmentAngle * randomIndex;

    // Ensure we rotate at least 5 full rotations plus landing on the selected segment
    const landingPosition = 360 - segmentRotation + (segmentAngle / 2);
    const newRotation = rotation + (360 * 5) + landingPosition;

    setRotation(newRotation);

    // Wait for animation to complete before calling onSpinEnd
    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(selectedChore);
    }, 5000); // This should match the CSS transition duration
  };

  // Reset the wheel after an excessive number of spins to prevent extreme values
  useEffect(() => {
    if (rotation > 3600 && !isSpinning) {
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
    if (chore.type === 'afk') {
      backgroundColor = `linear-gradient(135deg, #2E7D32 0%, #1b5e20 100%)`;
    } else if (chore.type === 'gathering') {
      backgroundColor = `linear-gradient(135deg, #1565C0 0%, #0d47a1 100%)`;
    } else if (chore.type === 'boss') {
      backgroundColor = `linear-gradient(135deg, #C62828 0%, #b71c1c 100%)`;
    } else {
      backgroundColor = `linear-gradient(135deg, #E67700 0%, #d84315 100%)`;
    }

    // Calculate padding based on number of segments
    const paddingBottom = totalChores <= 6 ? '45%' : 
                        totalChores <= 8 ? '55%' : 
                        totalChores <= 12 ? '65%' : '72%';

    // Calculate additional text-shadow intensity based on number of segments
    const textShadowIntensity = totalChores <= 8 ? '0 0 4px rgba(0,0,0,0.9)' : 
                                totalChores <= 12 ? '0 0 6px rgba(0,0,0,1)' :
                                '0 0 8px rgba(0,0,0,1), 0 0 4px #000';

    return {
      segment: {
        transform: `rotate(${rotateAngle}deg) skewY(${skewAngle}deg)`,
        background: backgroundColor,
        backgroundSize: '200% 200%',
        width: '50%',
      },
      text: {
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
      }
    };
  };

  return (
    <div className="wheel-container">
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
            >
              <span 
                className="segment-text"
                style={styles.text}
              >
                {/* Truncate text differently based on segment count for better readability */}
                {chore.name.length > 15 && chores.length > 8 
                  ? `${chore.name.substring(0, 10)}...` 
                  : chore.name.length > 20
                    ? `${chore.name.substring(0, 18)}...`
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
        {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>
    </div>
  );
};

export default ChoreWheel;
