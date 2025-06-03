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
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinWheel = () => {
    if (isSpinning || chores.length === 0) return;
    
    setIsSpinning(true);
    
    // Randomly select a chore
    const randomIndex = Math.floor(Math.random() * chores.length);
    const selectedChore = chores[randomIndex];
    
    // Calculate the rotation to land on that chore
    const segmentAngle = 360 / chores.length;
    const segmentRotation = segmentAngle * randomIndex;
    
    // Ensure we rotate at least 5 full rotations plus landing on the selected segment
    // The pointer is at top (0 degrees), so we need to add 360 - segmentRotation + half segment
    // to land the pointer on the middle of the segment
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
    return (
    <div className="wheel-container">
      <div className="wheel-pointer"></div>
      <div 
        ref={wheelRef}
        className={`wheel ${isSpinning ? 'spinning' : ''}`} 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {chores.map((chore, index) => {
          // Calculate the rotation for each segment to be evenly distributed
          const segmentAngle = 360 / chores.length;
          const rotateAngle = index * segmentAngle;
          const skewAngle = 90 - segmentAngle;
          
          // Calculate background color based on chore type
          let backgroundColor = '#FF9800'; // default
          if (chore.type === 'afk') backgroundColor = '#4CAF50';
          else if (chore.type === 'gathering') backgroundColor = '#2196F3';
          else if (chore.type === 'boss') backgroundColor = '#F44336';
            return (
            <div 
              key={index}
              className="wheel-segment" 
              style={{ 
                transform: `rotate(${rotateAngle}deg) skewY(${skewAngle}deg)`,
                backgroundColor,
                width: '50%', // Set width to 50% of the wheel radius
              }}
            >
              <span 
                className="segment-text"
                style={{ 
                  transform: `skewY(${-skewAngle}deg) rotate(${segmentAngle / 2}deg)`,
                  transformOrigin: 'bottom center',
                  // Adjust text position based on segment count
                  paddingBottom: `${chores.length <= 6 ? '40%' : chores.length <= 10 ? '60%' : '70%'}`
                }}
              >
                {chore.name.length > 15 && chores.length > 8 
                  ? `${chore.name.substring(0, 12)}...` 
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
