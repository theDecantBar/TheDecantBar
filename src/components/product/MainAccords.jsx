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
        {accords.map((accordItem, idx) => {
          const name = typeof accordItem === "string" ? accordItem : (accordItem?.name || "");
          if (!name) return null;
          const color = typeof accordItem === "object" && accordItem?.color ? accordItem.color : "#543e2e";
          const rawPct = typeof accordItem === "object" && typeof accordItem?.percentage === "number" ? accordItem.percentage : (100 - idx * 10);
          const widthPercent = Math.max(24, Math.min(100, rawPct));
          return (
            <div
              key={name + idx}
              className="h-6 rounded flex items-center px-3 border border-white/5 shadow-sm transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: color,
                width: `${widthPercent}%`,
              }}
            >
              <span className="text-[11px] font-medium text-white/95 tracking-wide capitalize drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
