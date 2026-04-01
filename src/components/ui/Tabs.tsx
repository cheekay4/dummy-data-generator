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
    <div className="flex border-b border-washi">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-3 py-1.5
            font-sora text-[11px] font-medium
            border-b-2 -mb-px
            transition-colors duration-150
            ${
              activeTab === tab.id
                ? 'border-shu text-sumi'
                : 'border-transparent text-fude hover:text-sumi hover:border-washi'
            }
          `.trim()}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
