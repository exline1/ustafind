import { useState } from 'react';

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab?: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  const [active, setActive] = useState(activeTab || tabs[0]?.id || '');
  const currentTab = activeTab ?? active;

  const handleChange = (tabId: string) => {
    setActive(tabId);
    onTabChange(tabId);
  };

  return (
    <div className={`flex bg-gray-light/60 rounded-xl p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={`flex-1 py-2.5 px-4 min-h-[44px] text-xs font-semibold rounded-lg uppercase tracking-wide transition-all duration-300 ease-in-out ${
            currentTab === tab.id
              ? 'bg-brand-dark text-white shadow-sm'
              : 'text-gray-muted hover:text-brand-dark bg-transparent'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
