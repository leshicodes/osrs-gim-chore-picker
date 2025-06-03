import React from 'react';
import type { Chore } from '../types';
import './RecentChores.css';

interface RecentChoresProps {
  recentChores: Chore[];
}

const RecentChores: React.FC<RecentChoresProps> = ({ recentChores }) => {
  if (recentChores.length === 0) {
    return null;
  }

  return (
    <div className="recent-chores-container">
      <h2 className="recent-chores-title">Recently Picked Chores</h2>
      
      <div className="recent-chores-list">
        {recentChores.map((chore, index) => (
          <div 
            key={index} 
            className={`recent-chore-item recent-chore-type-${chore.type.toLowerCase()}`}
          >
            <div className="recent-chore-name">
              <span className="recent-chore-position">{index + 1}</span>
              {chore.name}
            </div>
            
            {chore.difficulty && (
              <div className={`recent-chore-difficulty difficulty-${chore.difficulty}`}>
                {chore.difficulty}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentChores;
