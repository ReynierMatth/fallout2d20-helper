import { useState, useRef, useEffect, useLayoutEffect, ReactNode } from 'react';
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
  // Mode contrôlé (optionnel) — si fourni, la tab bar interne est masquée
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

export function SwipeableTabs({ tabs, defaultTab = 0, activeIndex: controlledIndex, onTabChange }: SwipeableTabsProps) {
  const isControlled = controlledIndex !== undefined && onTabChange !== undefined;

  const [internalIndex, setInternalIndex] = useState(defaultTab);
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const panel = panelRefs.current[activeIndex];
    if (panel) setContainerHeight(panel.offsetHeight);
  }, [activeIndex]);

  useEffect(() => {
    const panel = panelRefs.current[activeIndex];
    if (!panel) return;
    const observer = new ResizeObserver(() => {
      setContainerHeight(panel.offsetHeight);
    });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [activeIndex]);

  const goToTab = (index: number, scrollUp = false) => {
    if (isControlled) {
      onTabChange(index);
    } else {
      setInternalIndex(index);
    }
    if (scrollUp) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const bind = useDrag(
    ({ dragging, last, movement: [mx], velocity: [vx], direction: [dx] }) => {
      if (dragging) {
        setIsDragging(true);
        const canGoLeft = activeIndex < tabs.length - 1;
        const canGoRight = activeIndex > 0;
        if ((mx < 0 && canGoLeft) || (mx > 0 && canGoRight)) {
          setDragOffset(mx);
        }
        return;
      }

      if (last) {
        setIsDragging(false);
        setDragOffset(0);

        const swipeLeft = dx < 0 && (Math.abs(mx) > 50 || vx > 0.3);
        const swipeRight = dx > 0 && (Math.abs(mx) > 50 || vx > 0.3);

        if (swipeLeft && activeIndex < tabs.length - 1) {
          goToTab(activeIndex + 1, true);
        } else if (swipeRight && activeIndex > 0) {
          goToTab(activeIndex - 1, true);
        }
      }
    },
    { axis: 'x', filterTaps: true }
  );

  return (
    <div ref={wrapperRef} className="flex flex-col">
      {/* Tab bar interne — uniquement en mode non contrôlé */}
      {!isControlled && (
        <div className="flex gap-2 mb-3">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => goToTab(index)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
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
      )}

      {/* Sliding content */}
      <div
        className="overflow-hidden"
        style={{
          height: containerHeight !== undefined ? `${containerHeight}px` : undefined,
          transition: isDragging ? 'none' : 'height 300ms ease-in-out',
          touchAction: 'pan-y',
        }}
        {...bind()}
      >
        <div
          className="flex items-start"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 300ms ease-in-out',
          }}
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={el => { panelRefs.current[index] = el; }}
              className="w-full flex-shrink-0 min-w-full px-2"
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator — fixed en bas, toujours visible */}
      {tabs.length > 1 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-vault-blue-dark/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {tabs.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToTab(index)}
              className={`rounded-full transition-all cursor-pointer ${
                activeIndex === index
                  ? 'bg-vault-yellow w-4 h-2'
                  : 'bg-vault-yellow-dark opacity-50 w-2 h-2'
              }`}
              aria-label={`Tab ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
