import React from "react";
import {
  Clock,
  Snowflake,
  Leaf,
  Sun,
  Moon
} from "lucide-react";

/**
 * Luxury "When to Wear" component matching The Decant Bar's dark gold aesthetic.
 * Displays seasonal and day/night suitability via subtle gold meters without numerical ratings.
 */
export default function WhenToWear({
  whenToWear = { winter: 4000, spring: 1400, summer: 564, fall: 3900, day: 2100, night: 3800 }
}) {
  const maxWearCount = Math.max(
    whenToWear.winter || 1,
    whenToWear.spring || 1,
    whenToWear.summer || 1,
    whenToWear.fall || 1,
    whenToWear.day || 1,
    whenToWear.night || 1
  );

  const seasons = [
    { key: "winter", label: "Winter", icon: Snowflake, count: whenToWear.winter || 0 },
    { key: "spring", label: "Spring", icon: Leaf, count: whenToWear.spring || 0 },
    { key: "summer", label: "Summer", icon: Sun, count: whenToWear.summer || 0 },
    { key: "fall", label: "Fall", icon: Leaf, count: whenToWear.fall || 0 },
  ];

  const times = [
    { key: "day", label: "Day", icon: Sun, count: whenToWear.day || 0 },
    { key: "night", label: "Night", icon: Moon, count: whenToWear.night || 0 },
  ];

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#c6a15b]" />
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-medium">
            When to Wear
          </h3>
        </div>
        <span className="text-[11px] text-[#8e8a82]">
          Seasonal & Time Suitability
        </span>
      </div>

      <div className="border border-white/10 bg-[#151512] rounded-lg p-4 sm:p-5">
        <div className="grid grid-cols-6 gap-2 sm:gap-3 text-center">
          {/* Seasons */}
          {seasons.map((item) => {
            const Icon = item.icon;
            const barWidth = Math.max(12, Math.round((item.count / maxWearCount) * 100));
            const isDominant = barWidth >= 75;

            return (
              <div key={item.key} className="flex flex-col items-center py-1.5 px-1">
                <div
                  className={`p-2 rounded-md mb-2 transition-colors ${
                    isDominant
                      ? "text-[#c6a15b] bg-[#c6a15b]/10 ring-1 ring-[#c6a15b]/30"
                      : "text-[#c5c1b9]/70 bg-white/5"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.5} />
                </div>
                <span className={`text-[11px] tracking-wide mb-2 ${
                  isDominant ? "text-[#f4efe6] font-medium" : "text-[#8e8a82]"
                }`}>
                  {item.label}
                </span>
                {/* Subtle Luxury Gold Progress Bar (NO NUMBERS) */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDominant
                        ? "bg-gradient-to-r from-[#c6a15b] to-[#e4cc92]"
                        : "bg-[#8e8a82]/50"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Times of day */}
          {times.map((item) => {
            const Icon = item.icon;
            const barWidth = Math.max(12, Math.round((item.count / maxWearCount) * 100));
            const isDominant = barWidth >= 75;

            return (
              <div key={item.key} className="flex flex-col items-center py-1.5 px-1 border-l border-white/10 pl-2 sm:pl-3">
                <div
                  className={`p-2 rounded-md mb-2 transition-colors ${
                    isDominant
                      ? "text-[#c6a15b] bg-[#c6a15b]/10 ring-1 ring-[#c6a15b]/30"
                      : "text-[#c5c1b9]/70 bg-white/5"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.5} />
                </div>
                <span className={`text-[11px] tracking-wide mb-2 ${
                  isDominant ? "text-[#f4efe6] font-medium" : "text-[#8e8a82]"
                }`}>
                  {item.label}
                </span>
                {/* Subtle Luxury Gold Progress Bar (NO NUMBERS) */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDominant
                        ? "bg-gradient-to-r from-[#c6a15b] to-[#e4cc92]"
                        : "bg-[#8e8a82]/50"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
