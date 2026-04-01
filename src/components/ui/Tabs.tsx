'use client';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps): JSX.Element {
  return (
    <div className="flex border-b border-[rgba(255,255,255,0.1)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2.5
            font-sora text-[13px] font-semibold
            border-b-2 -mb-px
            transition-all duration-300
            ${
              activeTab === tab.id
                ? 'border-[var(--brand-accent)] text-white'
                : 'border-transparent text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:border-[rgba(255,255,255,0.2)]'
            }
          `.trim()}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
