import { useState, ReactNode } from 'react';
import { useDrag } from '@use-gesture/react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface SwipeableTabsProps {
  tabs: Tab[];
  defaultTab?: number;
}

export function SwipeableTabs({ tabs, defaultTab = 0 }: SwipeableTabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultTab);

  const bind = useDrag(
    ({ last, movement: [mx], velocity: [vx], direction: [dx] }) => {
      if (!last) return;

      const swipeLeft = dx < 0 && (Math.abs(mx) > 50 || vx > 0.3);
      const swipeRight = dx > 0 && (Math.abs(mx) > 50 || vx > 0.3);

      if (swipeLeft && activeIndex < tabs.length - 1) {
        setActiveIndex(prev => prev + 1);
      } else if (swipeRight && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
      }
    },
    { axis: 'x', filterTaps: true }
  );

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeIndex === index
                ? 'bg-vault-yellow text-vault-blue font-bold'
                : 'bg-vault-gray border border-vault-yellow-dark text-vault-yellow-dark hover:border-vault-yellow hover:text-vault-yellow'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sliding content */}
      <div className="overflow-hidden" {...bind()}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {tabs.map((tab) => (
            <div key={tab.id} className="w-full flex-shrink-0 min-w-full">
              {tab.content}
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {tabs.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {tabs.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                activeIndex === index
                  ? 'bg-vault-yellow'
                  : 'bg-vault-yellow-dark opacity-50'
              }`}
              aria-label={`Tab ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
