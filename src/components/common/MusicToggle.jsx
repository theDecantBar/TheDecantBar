import { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../../context/AudioContext";

export default function MusicToggle({ className = "" }) {
  const { soundEnabled, isPlaying, toggleSound } = useAudio();

  // Keyboard shortcut: Press "M" to toggle sound when not typing in form inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        e.target?.isContentEditable
      ) {
        return;
      }
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleSound();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSound]);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={
        soundEnabled
          ? "Mute background music (Press M)"
          : "Play background music (Press M)"
      }
      aria-pressed={soundEnabled}
      title={
        soundEnabled
          ? "Sound is ON. Click or press 'M' to mute."
          : "Sound is OFF. Click or press 'M' to play."
      }
      className={`group inline-flex h-9 sm:h-11 shrink-0 items-center gap-2 px-2.5 sm:px-3.5 rounded-full backdrop-blur-md transition-all duration-300 border cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a15b] active:scale-95 ${
        soundEnabled
          ? "border-[#c6a15b] bg-[#c6a15b]/20 text-[#f4efe6] shadow-[0_0_18px_rgba(198,161,91,0.28)] hover:bg-[#c6a15b]/30"
          : "border-[#c6a15b]/45 bg-[#171715]/90 text-[#e6dcc8] shadow-[0_4px_14px_rgba(0,0,0,0.45)] hover:border-[#c6a15b] hover:bg-[#c6a15b]/12 hover:text-[#fffdf7]"
      } ${className}`}
    >
      {/* Audio Icon */}
      <span className="flex items-center justify-center text-[#c6a15b] transition-transform duration-200 group-hover:scale-105">
        {soundEnabled ? (
          <Volume2 size={15} strokeWidth={1.75} className="shrink-0" />
        ) : (
          <VolumeX size={15} strokeWidth={1.75} className="shrink-0 opacity-85 group-hover:opacity-100" />
        )}
      </span>

      {/* Minimal Animated Soundwave Equalizer */}
      <div
        className="flex items-end gap-[2px] h-3 w-3 shrink-0"
        aria-hidden="true"
      >
        <span
          className={`w-[2px] rounded-full transition-all duration-300 ${
            soundEnabled && isPlaying
              ? "bg-[#c6a15b] animate-soundbar-1"
              : soundEnabled
              ? "h-2 bg-[#c6a15b]"
              : "h-1.5 bg-[#c6a15b]/45 group-hover:bg-[#c6a15b]/80"
          }`}
        />
        <span
          className={`w-[2px] rounded-full transition-all duration-300 ${
            soundEnabled && isPlaying
              ? "bg-[#c6a15b] animate-soundbar-2"
              : soundEnabled
              ? "h-3 bg-[#c6a15b]"
              : "h-2.5 bg-[#c6a15b]/45 group-hover:bg-[#c6a15b]/80"
          }`}
        />
        <span
          className={`w-[2px] rounded-full transition-all duration-300 ${
            soundEnabled && isPlaying
              ? "bg-[#c6a15b] animate-soundbar-3"
              : soundEnabled
              ? "h-1.5 bg-[#c6a15b]"
              : "h-1 bg-[#c6a15b]/45 group-hover:bg-[#c6a15b]/80"
          }`}
        />
        <span
          className={`w-[2px] rounded-full transition-all duration-300 ${
            soundEnabled && isPlaying
              ? "bg-[#c6a15b] animate-soundbar-4"
              : soundEnabled
              ? "h-2.5 bg-[#c6a15b]"
              : "h-2 bg-[#c6a15b]/45 group-hover:bg-[#c6a15b]/80"
          }`}
        />
      </div>

      {/* Label on wider screens */}
      <span
        className={`hidden xl:inline text-[10.5px] font-sans font-semibold tracking-[0.16em] uppercase transition-colors duration-200 whitespace-nowrap ${
          soundEnabled
            ? "text-[#f5dfb0]"
            : "text-[#d8c08a] group-hover:text-[#f5dfb0]"
        }`}
      >
        {soundEnabled ? "Sound On" : "Sound"}
      </span>

      {/* Highlight Glow Dot */}
      <span
        className={`hidden sm:inline-block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          soundEnabled
            ? "bg-[#c6a15b] shadow-[0_0_8px_rgba(198,161,91,0.95)]"
            : "bg-[#c6a15b]/40 group-hover:bg-[#c6a15b]/80"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
