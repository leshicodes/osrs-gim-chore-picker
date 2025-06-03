import { useState } from 'react';
import type { Chore, ChoreType, Difficulty } from './types';
import Header from './components/Header';
import ChoreWheel from './components/ChoreWheel';
import ChoreResult from './components/ChoreResult';
import ChoreFilters from './components/ChoreFilters';
import RecentChores from './components/RecentChores';
import AddChoreForm from './components/AddChoreForm';
import { useChores } from './hooks/useChores';
import './App.css';

function App() {
  const { 
    chores, 
    isLoading, 
    error, 
    recentChores,
    availableTypes,
    availableDifficulties,
    addCustomChore,
    clearRecentChores,
    filters,
    setFilter
  } = useChores();
  
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [useOsrsBackground, setUseOsrsBackground] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSpinEnd = (chore: Chore) => {
    setSelectedChore(chore);
    setShowResult(true);
  };

  const closeResult = () => {
    setShowResult(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleBackground = () => {
    setUseOsrsBackground(!useOsrsBackground);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (
    type: 'types' | 'difficulties' | 'excludeRecent', 
    value: ChoreType[] | Difficulty[] | boolean
  ) => {
    setFilter(type, value);
  };

  return (
    <div className={`app ${useOsrsBackground ? 'osrs-background' : ''}`}>
      <Header />
      
      <main className="app-content">
        {isLoading ? (
          <div className="loading">Loading chores...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <>
            <div className="controls-container">
              <button 
                className={`control-button ${showFilters ? 'active' : ''}`} 
                onClick={toggleFilters}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters & Options'}
              </button>
              
              <button className="control-button" onClick={toggleSettings}>
                ⚙️ Settings
              </button>
            </div>
            
            {showSettings && (
              <div className="settings-panel">
                <h3>Settings</h3>
                <div className="setting-option">
                  <label className="setting-label">
                    <input 
                      type="checkbox"
                      checked={useOsrsBackground}
                      onChange={toggleBackground}
                    />
                    Use OSRS Background
                  </label>
                </div>
              </div>
            )}
            
            {showFilters && (
              <div className="filters-and-tools">
                <ChoreFilters
                  availableTypes={availableTypes}
                  availableDifficulties={availableDifficulties}
                  activeFilters={filters}
                  onFilterChange={handleFilterChange}
                  recentChoresCount={recentChores.length}
                  onClearRecent={clearRecentChores}
                />
                
                <AddChoreForm 
                  availableTypes={availableTypes}
                  onAddChore={addCustomChore}
                />
              </div>
            )}
            
            <ChoreWheel chores={chores} onSpinEnd={handleSpinEnd} />
            
            <RecentChores recentChores={recentChores} />
            
            <ChoreResult 
              selectedChore={selectedChore} 
              isVisible={showResult} 
            />
            {showResult && (
              <div className="backdrop" onClick={closeResult}></div>
            )}
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Nutville GIM Chore Picker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App
