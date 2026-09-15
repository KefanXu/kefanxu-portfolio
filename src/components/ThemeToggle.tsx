import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { NeuButton } from './NeuButton';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <NeuButton onClick={toggleTheme} circle aria-label="Toggle Theme">
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </NeuButton>
  );
};





