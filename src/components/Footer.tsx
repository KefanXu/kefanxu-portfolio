import React from 'react';
import { personalInfo } from '../data/portfolio';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 mt-12 bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        
        <p className="text-sm text-text-light/60 dark:text-text-dark/60">
          © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

