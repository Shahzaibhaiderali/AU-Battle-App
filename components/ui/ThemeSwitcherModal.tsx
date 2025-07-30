import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Theme } from '../../types';

interface ThemeSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { setTheme, theme } = useTheme();

  if (!isOpen) {
    return null;
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    onClose();
  };
  
  const themes = [
    { id: Theme.Dark, name: 'Dark', bg: 'bg-[#0c0a3a]', text: 'text-white' },
    { id: Theme.Light, name: 'Light', bg: 'bg-[#f0f2f5]', text: 'text-black' },
    { id: Theme.Tidal, name: 'Tidal', bg: 'bg-[#0A191E]', text: 'text-white' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in-up"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-theme rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-theme-primary text-center mb-6">Select a Theme</h2>
        <div className="space-y-4">
          {themes.map((t) => (
             <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`w-full p-4 rounded-lg text-left flex items-center justify-between transition-all border-2 ${theme === t.id ? 'border-accent-primary' : 'border-transparent hover:border-gray-600'}`}
              >
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full mr-4 ${t.bg} border border-theme`}></div>
                    <span className="font-semibold text-theme-primary">{t.name}</span>
                </div>
                {theme === t.id && (
                    <div className="w-5 h-5 rounded-full bg-accent-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                )}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcherModal;