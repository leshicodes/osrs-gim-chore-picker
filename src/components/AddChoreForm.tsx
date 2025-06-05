import React, { useState } from 'react';
import type { Chore, ChoreType, Difficulty } from '../types';
import './AddChoreForm.css';

interface AddChoreFormProps {
  availableTypes: string[];
  onAddChore: (chore: Chore) => void;
}

const AddChoreForm: React.FC<AddChoreFormProps> = ({ availableTypes, onAddChore }) => {
  const [showForm, setShowForm] = useState(false);  const [choreName, setChoreName] = useState('');
  const [choreType, setChoreType] = useState<ChoreType>('afk');
  const [choreDifficulty, setChoreDifficulty] = useState<Difficulty>('medium');
  const [choreNotes, setChoreNotes] = useState('');
  const [customType, setCustomType] = useState('');
  const [useCustomType, setUseCustomType] = useState(false);
  const [useCount, setUseCount] = useState(false);
  const [minCount, setMinCount] = useState('100');
  const [maxCount, setMaxCount] = useState('1000');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!choreName.trim()) return;
    
    const newChore: Chore = {
      name: choreName.trim(),
      type: useCustomType && customType.trim() ? customType.trim() : choreType,
      difficulty: choreDifficulty,
      notes: choreNotes.trim() || undefined
    };
    
    // Add count property if enabled and values are valid
    if (useCount) {
      const min = parseInt(minCount);
      const max = parseInt(maxCount);
      
      // Validate that min and max are valid numbers and min <= max
      if (!isNaN(min) && !isNaN(max) && min <= max) {
        newChore.count = { 
          min, 
          max
        };
        console.log('Added count to new chore:', newChore.count);
      }
    }
    
    onAddChore(newChore);
    resetForm();
  };
    const resetForm = () => {
    setChoreName('');
    setChoreType('afk');
    setChoreDifficulty('medium');
    setChoreNotes('');
    setCustomType('');
    setUseCustomType(false);
    setUseCount(false);
    setMinCount('100');
    setMaxCount('1000');
  };
  
  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm();
    }
  };

  return (
    <div className="add-chore-container">
      <button 
        className="toggle-form-button"
        onClick={toggleForm}
      >
        {showForm ? 'Cancel' : '+ Add New Chore'}
      </button>
      
      {showForm && (
        <form className="add-chore-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Add a New Chore</h2>
          </div>
          
          <div className="form-group">
            <label htmlFor="choreName">Chore Name:</label>
            <input
              id="choreName"
              type="text"
              value={choreName}
              onChange={(e) => setChoreName(e.target.value)}
              placeholder="Fish Monkfish, Kill Zulrah..."
              required
              maxLength={50}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="choreType">Chore Type:</label>
            
            {useCustomType ? (
              <input
                id="customType"
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Enter custom type"
                maxLength={20}
              />
            ) : (
              <select
                id="choreType"
                value={choreType}
                onChange={(e) => setChoreType(e.target.value as ChoreType)}
              >
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            )}
            
            <div className="custom-type-toggle">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useCustomType}
                  onChange={() => setUseCustomType(!useCustomType)}
                />
                Use custom type
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="choreDifficulty">Difficulty:</label>
            <select
              id="choreDifficulty"
              value={choreDifficulty}
              onChange={(e) => setChoreDifficulty(e.target.value as Difficulty)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
            <div className="form-group">
            <label htmlFor="choreNotes">Notes (optional):</label>
            <textarea
              id="choreNotes"
              value={choreNotes}
              onChange={(e) => setChoreNotes(e.target.value)}
              placeholder="Any tips or requirements..."
              maxLength={200}
            />
          </div>
          
          <div className="form-group count-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useCount}
                onChange={() => setUseCount(!useCount)}
              />
              Add a count range (e.g. 100-1000)
            </label>
          </div>
          
          {useCount && (
            <div className="form-group count-inputs">
              <div className="count-range">
                <div className="count-field">
                  <label htmlFor="minCount">Minimum:</label>
                  <input
                    id="minCount"
                    type="number"
                    value={minCount}
                    onChange={(e) => setMinCount(e.target.value)}
                    min="1"
                  />
                </div>
                
                <div className="count-field">
                  <label htmlFor="maxCount">Maximum:</label>
                  <input
                    id="maxCount"
                    type="number"
                    value={maxCount}
                    onChange={(e) => setMaxCount(e.target.value)}
                    min={parseInt(minCount) || 1}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="form-buttons">
            <button
              type="button" 
              className="cancel-button"
              onClick={toggleForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={!choreName.trim()}
            >
              Add Chore
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddChoreForm;
