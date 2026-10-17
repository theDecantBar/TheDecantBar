/**
 * Main Accords component displaying horizontal concentration bars
 * styled with a refined, muted luxury palette matching The Decant Bar.
 */
export default function MainAccords({ accords = [], className = "" }) {
  if (!accords || accords.length === 0) return null;

  return (
    <div className={`mt-4 pt-3.5 border-t border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium flex items-center gap-2">
          <span>Main Accords & Themes</span>
        </h3>
        
      </div>

      <div className="space-y-1.5 max-w-md">
        {accords.map((accord, idx) => {
          const widthPercent = Math.max(24, Math.min(100, accord.percentage || (100 - idx * 10)));
          return (
            <div
              key={accord.name || idx}
              className="h-6 rounded flex items-center px-3 border border-white/5 shadow-sm transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: accord.color || "#543e2e",
                width: `${widthPercent}%`,
              }}
            >
              <span className="text-[11px] font-medium text-white/95 tracking-wide capitalize drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {accord.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
