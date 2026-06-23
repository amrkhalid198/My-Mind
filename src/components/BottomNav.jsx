/**
 * BottomNav — text-only fixed bottom navigation.
 * 
 * Critical mobile requirements:
 * - fixed to bottom viewport
 * - safe-area-inset-bottom padding for iPhone home indicator
 * - never hides content (content gets matching padding-bottom)
 * - no icons, no borders, no backgrounds beyond minimal
 */

export default function BottomNav({ screen, onNavigate }) {
  const tabs = [
    { id: 'home',   label: 'Home'   },
    { id: 'search', label: 'Search' },
    { id: 'new',    label: 'New'    },
  ];

  return (
    <nav
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-nb-bg
        border-t border-nb-line
        flex items-center justify-around
        pt-3
      "
    >
      {tabs.map(tab => {
        const isActive = screen === tab.id;
        // 'new' tab always appears as accent — it's an action, not a location
        const isNew = tab.id === 'new';

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`
              flex-1 text-center py-1
              font-sans text-sm tracking-wide
              transition-colors duration-100
              ${isActive
                ? 'text-nb-accent'
                : isNew
                  ? 'text-nb-accent/60 hover:text-nb-accent'
                  : 'text-nb-secondary hover:text-nb-primary'
              }
            `}
            // Minimum 44px touch target (Apple HIG)
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isNew ? (
              // Subtle '+' prefix on New to indicate action
              <span className="font-mono">+ {tab.label}</span>
            ) : (
              tab.label
            )}
          </button>
        );
      })}
    </nav>
  );
}
