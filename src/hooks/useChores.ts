import { useState, useEffect } from 'react';
import type { Chore, ChoreType, Difficulty } from '../types';
import choreData from '../data/chores.json';

const RECENT_CHORES_KEY = 'nutville-recent-chores';
const CUSTOM_CHORES_KEY = 'nutville-custom-chores';

export const useChores = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [filteredChores, setFilteredChores] = useState<Chore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    types: ChoreType[];
    difficulties: Difficulty[];
    excludeRecent: boolean;
  }>({
    types: [],
    difficulties: [],
    excludeRecent: false
  });
  const [recentChores, setRecentChores] = useState<Chore[]>([]);
  const [customChores, setCustomChores] = useState<Chore[]>([]);

  // Load chores from JSON and localStorage
  useEffect(() => {
    try {
      // Load custom chores from localStorage
      const storedCustomChores = localStorage.getItem(CUSTOM_CHORES_KEY);
      const parsedCustomChores = storedCustomChores ? JSON.parse(storedCustomChores) as Chore[] : [];
      
      // Load recent chores from localStorage
      const storedRecentChores = localStorage.getItem(RECENT_CHORES_KEY);
      const parsedRecentChores = storedRecentChores ? JSON.parse(storedRecentChores) as Chore[] : [];
      
      // Combine default chores with custom chores
      setChores([...choreData as Chore[], ...parsedCustomChores]);
      setFilteredChores([...choreData as Chore[], ...parsedCustomChores]);
      setCustomChores(parsedCustomChores);
      setRecentChores(parsedRecentChores);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load chores data');
      setIsLoading(false);
      console.error('Error loading chores:', err);
    }
  }, []);

  // Apply filters whenever chores or filters change
  useEffect(() => {
    let result = [...chores];
    
    // Filter by type
    if (activeFilters.types.length > 0) {
      result = result.filter(chore => activeFilters.types.includes(chore.type));
    }
    
    // Filter by difficulty
    if (activeFilters.difficulties.length > 0) {
      result = result.filter(chore => 
        chore.difficulty && activeFilters.difficulties.includes(chore.difficulty)
      );
    }
    
    // Exclude recently picked chores
    if (activeFilters.excludeRecent && recentChores.length > 0) {
      result = result.filter(chore => 
        !recentChores.some(recentChore => recentChore.name === chore.name)
      );
    }
    
    setFilteredChores(result);
  }, [chores, activeFilters, recentChores]);
  const getRandomChore = (): Chore | null => {
    if (filteredChores.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * filteredChores.length);
    const selectedChore = { ...filteredChores[randomIndex] };
    
    // Generate random count if min and max are provided
    if (selectedChore.count && typeof selectedChore.count.min === 'number' && typeof selectedChore.count.max === 'number') {
      const min = Math.ceil(selectedChore.count.min);
      const max = Math.floor(selectedChore.count.max);
      selectedChore.count.value = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log('Generated count value:', selectedChore.count.value);
    }
    
    // Add to recent chores
    if (selectedChore) {
      const updatedRecentChores = [{ ...selectedChore }, ...recentChores.slice(0, 4)]; // Keep last 5
      setRecentChores(updatedRecentChores);
      localStorage.setItem(RECENT_CHORES_KEY, JSON.stringify(updatedRecentChores));
    }
    
    return selectedChore;
  };

  const addCustomChore = (chore: Chore) => {
    const updatedCustomChores = [...customChores, chore];
    const updatedAllChores = [...chores, chore];
    
    setCustomChores(updatedCustomChores);
    setChores(updatedAllChores);
    
    // Save to localStorage
    localStorage.setItem(CUSTOM_CHORES_KEY, JSON.stringify(updatedCustomChores));
  };

  const removeCustomChore = (choreName: string) => {
    const updatedCustomChores = customChores.filter(c => c.name !== choreName);
    const updatedAllChores = chores.filter(c => {
      // Only remove if it's a custom chore
      const isCustom = customChores.some(custom => custom.name === c.name);
      return !(isCustom && c.name === choreName);
    });
    
    setCustomChores(updatedCustomChores);
    setChores(updatedAllChores);
    
    // Save to localStorage
    localStorage.setItem(CUSTOM_CHORES_KEY, JSON.stringify(updatedCustomChores));
  };

  const clearRecentChores = () => {
    setRecentChores([]);
    localStorage.removeItem(RECENT_CHORES_KEY);
  };

  const setFilter = (
    type: 'types' | 'difficulties' | 'excludeRecent', 
    value: ChoreType[] | Difficulty[] | boolean
  ) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Get all available types and difficulties in the dataset
  const availableTypes = [...new Set(chores.map(chore => chore.type))];
  const availableDifficulties = [
    ...new Set(chores.filter(chore => chore.difficulty).map(chore => chore.difficulty))
  ] as Difficulty[];

  return {
    chores: filteredChores,
    allChores: chores,
    isLoading,
    error,
    getRandomChore,
    recentChores,
    customChores,
    addCustomChore,
    removeCustomChore,
    clearRecentChores,
    filters: activeFilters,
    setFilter,
    availableTypes,
    availableDifficulties
  };
};
