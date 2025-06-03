import React from 'react';
import type { ChoreType, Difficulty } from '../types';
import './ChoreFilters.css';

interface ChoreFiltersProps {
  availableTypes: string[];
  availableDifficulties: Difficulty[];
  activeFilters: {
    types: ChoreType[];
    difficulties: Difficulty[];
    excludeRecent: boolean;
  };
  onFilterChange: (
    type: 'types' | 'difficulties' | 'excludeRecent', 
    value: ChoreType[] | Difficulty[] | boolean
  ) => void;
  recentChoresCount: number;
  onClearRecent: () => void;
}

const ChoreFilters: React.FC<ChoreFiltersProps> = ({
  availableTypes,
  availableDifficulties,
  activeFilters,
  onFilterChange,
  recentChoresCount,
  onClearRecent
}) => {
  const handleTypeFilterChange = (type: string) => {
    const updatedTypes = activeFilters.types.includes(type)
      ? activeFilters.types.filter(t => t !== type)
      : [...activeFilters.types, type];
    
    onFilterChange('types', updatedTypes);
  };

  const handleDifficultyFilterChange = (difficulty: Difficulty) => {
    const updatedDifficulties = activeFilters.difficulties.includes(difficulty)
      ? activeFilters.difficulties.filter(d => d !== difficulty)
      : [...activeFilters.difficulties, difficulty];
    
    onFilterChange('difficulties', updatedDifficulties);
  };

  const handleExcludeRecentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('excludeRecent', e.target.checked);
  };

  // Get human-readable difficulty name
  const getDifficultyName = (diff: Difficulty): string => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  // Get class for the filter buttons
  const getFilterClass = (isActive: boolean, type?: string): string => {
    let baseClass = 'filter-button';
    
    if (isActive) {
      baseClass += ' filter-active';
    }
    
    if (type) {
      baseClass += ` filter-type-${type}`;
    }
    
    return baseClass;
  };

  return (
    <div className="filters-container">
      <div className="filter-section">
        <h3>Filter by Type</h3>
        <div className="filter-buttons">
          {availableTypes.map((type) => (
            <button
              key={type}
              className={getFilterClass(activeFilters.types.includes(type), type)}
              onClick={() => handleTypeFilterChange(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Filter by Difficulty</h3>
        <div className="filter-buttons">
          {availableDifficulties.map((difficulty) => (
            <button
              key={difficulty}
              className={getFilterClass(
                activeFilters.difficulties.includes(difficulty), 
                difficulty
              )}
              onClick={() => handleDifficultyFilterChange(difficulty)}
            >
              {getDifficultyName(difficulty)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Recent Chores</h3>
        <div className="recent-controls">
          <label className="filter-checkbox">
            <input 
              type="checkbox"
              checked={activeFilters.excludeRecent}
              onChange={handleExcludeRecentChange}
            />
            Exclude recently picked ({recentChoresCount})
          </label>
          {recentChoresCount > 0 && (
            <button 
              className="filter-button clear-button"
              onClick={onClearRecent}
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoreFilters;
