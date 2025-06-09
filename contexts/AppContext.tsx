import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Vaccination, Theme } from '@/types';

interface AppContextType {
  pets: Pet[];
  vaccinations: Vaccination[];
  theme: Theme;
  selectedPet: Pet | null;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  selectPet: (pet: Pet | null) => void;
  addVaccination: (vaccination: Omit<Vaccination, 'id' | 'createdAt'>) => Promise<void>;
  deleteVaccination: (vaccinationId: string) => Promise<void>;
  toggleTheme: () => void;
  isLoading: boolean;
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#60A5FA',
    secondary: '#34D399',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [petsData, vaccinationsData, themeData] = await Promise.all([
        AsyncStorage.getItem('pets'),
        AsyncStorage.getItem('vaccinations'),
        AsyncStorage.getItem('theme'),
      ]);

      if (petsData) {
        setPets(JSON.parse(petsData));
      }
      if (vaccinationsData) {
        setVaccinations(JSON.parse(vaccinationsData));
      }
      if (themeData) {
        setTheme(JSON.parse(themeData) === 'dark' ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPet: Pet = {
      ...petData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
  };

  const updatePet = async (petId: string, updates: Partial<Pet>) => {
    const updatedPets = pets.map(pet =>
      pet.id === petId ? { ...pet, ...updates, updatedAt: new Date().toISOString() } : pet
    );
    setPets(updatedPets);
    await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));

    if (selectedPet?.id === petId) {
      setSelectedPet(updatedPets.find(pet => pet.id === petId) || null);
    }
  };

  const deletePet = async (petId: string) => {
    const updatedPets = pets.filter(pet => pet.id !== petId);
    const updatedVaccinations = vaccinations.filter(vacc => vacc.petId !== petId);
    
    setPets(updatedPets);
    setVaccinations(updatedVaccinations);
    
    await Promise.all([
      AsyncStorage.setItem('pets', JSON.stringify(updatedPets)),
      AsyncStorage.setItem('vaccinations', JSON.stringify(updatedVaccinations)),
    ]);

    if (selectedPet?.id === petId) {
      setSelectedPet(null);
    }
  };

  const selectPet = (pet: Pet | null) => {
    setSelectedPet(pet);
  };

  const addVaccination = async (vaccinationData: Omit<Vaccination, 'id' | 'createdAt'>) => {
    const newVaccination: Vaccination = {
      ...vaccinationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedVaccinations = [...vaccinations, newVaccination];
    setVaccinations(updatedVaccinations);
    await AsyncStorage.setItem('vaccinations', JSON.stringify(updatedVaccinations));
  };

  const deleteVaccination = async (vaccinationId: string) => {
    const updatedVaccinations = vaccinations.filter(vacc => vacc.id !== vaccinationId);
    setVaccinations(updatedVaccinations);
    await AsyncStorage.setItem('vaccinations', JSON.stringify(updatedVaccinations));
  };

  const toggleTheme = async () => {
    const newTheme = theme.isDark ? lightTheme : darkTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme.isDark ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider
      value={{
        pets,
        vaccinations,
        theme,
        selectedPet,
        addPet,
        updatePet,
        deletePet,
        selectPet,
        addVaccination,
        deleteVaccination,
        toggleTheme,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};