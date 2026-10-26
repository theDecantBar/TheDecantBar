import { getNoteVisual } from "../../data/fragranceNotesData";

function NoteCard({ noteName }) {
  const visual = getNoteVisual(noteName);

  return (
    <div className="flex flex-col items-center group w-14 sm:w-16 text-center transition-transform duration-200 hover:-translate-y-0.5">
      {/* Real Fragrantica ingredient thumbnail */}
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-white/15 bg-[#171715] flex items-center justify-center p-0.5 shadow-sm group-hover:border-[#c6a15b] group-hover:shadow-[0_0_8px_rgba(198,161,91,0.25)] transition-all">
        {visual.imageUrl ? (
          <img
            src={visual.imageUrl}
            alt={noteName}
            loading="lazy"
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = "flex";
              }
            }}
          />
        ) : null}
        <div className={`w-full h-full p-1.5 flex items-center justify-center ${visual.imageUrl ? "hidden" : "flex"}`}>
          {visual.fallbackIcon}
        </div>
      </div>

      {/* Note Name underneath */}
      <span className="mt-1.5 text-[10px] sm:text-[11px] font-medium text-[#f4efe6] tracking-tight leading-tight group-hover:text-[#c6a15b] transition-colors line-clamp-2">
        {noteName}
      </span>
    </div>
  );
}

export default function PerfumePyramid({
  topNotes = [],
  middleNotes = [],
  baseNotes = [],
  vibe = ""
}) {
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3.5">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-[#c6a15b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 22 22 22" />
            <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium">
            Perfume Pyramid
          </h3>
        </div>
        {vibe && (
          <span className="text-[11px] text-[#8e8a82]">
            Vibe: <strong className="text-[#f4efe6] font-normal">{vibe}</strong>
          </span>
        )}
      </div>

      {/* Compact Stepped Pyramid Container */}
      <div className="border border-white/10 bg-[#151512] rounded-2xl p-3.5 sm:p-4 relative">
        <div className="flex flex-col items-center gap-3.5 sm:gap-4">
          {/* TIER 1: TOP NOTES */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-center mb-1.5">
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8e8a82]">
                TOP NOTES
              </span>
              <span className="text-[9px] text-[#c6a15b]/80">· Opening (First 15–30 mins)</span>
            </div>
            <div className="flex flex-wrap items-start justify-center gap-2.5 sm:gap-3.5">
              {topNotes.map((note) => (
                <NoteCard key={note} noteName={note} />
              ))}
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-36 sm:w-48 h-px bg-white/10" />

          {/* TIER 2: MIDDLE NOTES */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-center mb-1.5">
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8e8a82]">
                MIDDLE NOTES
              </span>
              <span className="text-[9px] text-[#c6a15b]/80">· Core Body (Hours 2–5)</span>
            </div>
            <div className="flex flex-wrap items-start justify-center gap-2.5 sm:gap-3.5">
              {middleNotes.map((note) => (
                <NoteCard key={note} noteName={note} />
              ))}
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-48 sm:w-64 h-px bg-white/10" />

          {/* TIER 3: BASE NOTES */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-center mb-1.5">
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8e8a82]">
                BASE NOTES
              </span>
              <span className="text-[9px] text-[#c6a15b]/80">· Dry Down (Hours 6–12+)</span>
            </div>
            <div className="flex flex-wrap items-start justify-center gap-2.5 sm:gap-3.5">
              {baseNotes.map((note) => (
                <NoteCard key={note} noteName={note} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
