import React, { useEffect, useRef } from 'react';
import type { Chore } from '../types';
import './ChoreResult.css';
import confetti from 'canvas-confetti';

interface ChoreResultProps {
  selectedChore: Chore | null;
  isVisible: boolean;
}

const ChoreResult: React.FC<ChoreResultProps> = ({ selectedChore, isVisible }) => {
  const confettiRef = useRef<HTMLDivElement>(null);
  
  // Function to determine the difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  // Function to create a class name for the chore type
  const getTypeClass = (type?: string) => {
    switch (type) {
      case 'afk': return 'type-afk';
      case 'gathering': return 'type-gathering';
      case 'boss': return 'type-boss';
      default: return 'type-other';
    }
  };

  // Trigger the confetti effect when a chore is selected
  useEffect(() => {
    if (isVisible && selectedChore && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Fire confetti from the middle of the card
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { 
          x: x / window.innerWidth, 
          y: y / window.innerHeight 
        },
        colors: ['#F7CC32', '#EABE14', '#C59E00', '#D4A257', '#8d6e41'],
        zIndex: 1000
      });
      
      // Fire golden confetti from the sides
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 50,
          origin: { x: 0, y: 0.7 },
          colors: ['#F7CC32', '#EABE14', '#C59E00'],
          zIndex: 1000
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 50,
          origin: { x: 1, y: 0.7 },
          colors: ['#F7CC32', '#EABE14', '#C59E00'],
          zIndex: 1000
        });
      }, 500);
    }
  }, [isVisible, selectedChore]);

  if (!isVisible || !selectedChore) {
    return null;
  }  return (
    <div className={`chore-result ${isVisible ? 'visible' : ''}`}>
      <div className="result-card" ref={confettiRef}>
        <div className="result-card-corners"><span></span></div>
        
        <button className="close-button" onClick={() => document.querySelector('.backdrop')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>×</button>
        
        <h2 className="result-title">Your Chore</h2>
        <div className="chore-name">{selectedChore.name}</div>
        
        <div className="chore-details">
          <div className={`chore-type ${getTypeClass(selectedChore.type)}`}>
            {selectedChore.type.toUpperCase()}
          </div>
          
          {selectedChore.difficulty && (
            <div 
              className="chore-difficulty"
              style={{ backgroundColor: getDifficultyColor(selectedChore.difficulty) }}
            >
              {selectedChore.difficulty.toUpperCase()}
            </div>
          )}
        </div>
        
        {selectedChore.notes && (
          <div className="chore-notes">
            {selectedChore.notes}
          </div>
        )}
        
        <div className="button-divider"></div>
        
        <button 
          onClick={() => {
            confetti({
              particleCount: 70,
              spread: 90,
              origin: { x: 0.5, y: 0.5 },
              colors: ['#e6b932', '#c8a75a', '#9c7a3c', '#ffcc33', '#ffffff'],
              zIndex: 1000
            });
          }}
          className="confetti-button"
        >
          Celebrate again
        </button>
      </div>
    </div>
  );
};

export default ChoreResult;
