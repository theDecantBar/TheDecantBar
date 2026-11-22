/**
 * Main Accords component displaying ranked accord bars
 * styled with a refined, muted luxury palette matching The Decant Bar.
 */
export default function MainAccords({ accords = [], className = "" }) {
  if (!accords || accords.length === 0) return null;

  const accordColors = {
    "warm spicy": "#9b4437",
    cinnamon: "#b65f32",
    woody: "#765442",
    sweet: "#a94e76",
    tobacco: "#5b3c2c",
    fruity: "#a74863",
    amber: "#b8752f",
    aromatic: "#47644b",
    vanilla: "#92754d",
    "fresh spicy": "#367b76",
    citrus: "#a38a32",
    floral: "#a65478",
    "white floral": "#8e7188",
    green: "#587746",
    aquatic: "#39788b",
    marine: "#306d7e",
    musky: "#746879",
    powdery: "#947f8d",
    leather: "#674638",
    smoky: "#554d49",
    earthy: "#75613e",
    mossy: "#53633e",
    coffee: "#64412f",
    chocolate: "#67402f",
    gourmand: "#9c5b48",
    salty: "#647d86",
    mineral: "#687782",
    herbal: "#55724e",
    rose: "#a5465a",
    iris: "#77628a",
    lavender: "#76628e",
    patchouli: "#566344",
    balsamic: "#79563d",
    animalic: "#70523f",
    conifer: "#3f6845",
    fresh: "#5a9995",
  };

  const getAccordColor = (name) => {
    const key = name.toLowerCase().trim();
    if (accordColors[key]) return accordColors[key];
    // Stable, distinct fallback hue for accords outside the curated palette.
    const hue = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue} 34% 37%)`;
  };

  // Preserve source ranking; percentages are not published ingredient concentrations.
  const sortedAccords = accords;

  return (
    <div className={`mt-4 pt-3.5 border-t border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium flex items-center gap-2">
          <span>Main Accords & Themes</span>
        </h3>
        
      </div>

      <div className="space-y-1.5 max-w-md">
        {sortedAccords.map((accordItem, idx) => {
          const name = typeof accordItem === "string" ? accordItem : (accordItem?.name || "");
          if (!name) return null;
          const color = typeof accordItem === "object" && accordItem?.color
            ? accordItem.color
            : getAccordColor(name);
          const widthPercent = Math.max(24, 100 - idx * 10);
          return (
            <div
              key={name + idx}
              className="h-6 rounded-2xl flex items-center px-3 border border-white/5 shadow-sm transition-all duration-300 hover:brightness-110"
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
