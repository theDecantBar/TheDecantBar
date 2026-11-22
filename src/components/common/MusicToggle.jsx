import { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../../context/AudioContext";

export default function MusicToggle() {
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
    <aside
      aria-label="Background music controls"
      className="fixed bottom-5 left-5 z-40 sm:bottom-6 sm:left-6 select-none pointer-events-auto"
    >
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
        className={`group flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full backdrop-blur-md transition-all duration-300 border shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a15b] active:scale-95 ${
          soundEnabled
            ? "bg-[#141412]/85 border-[#c6a15b]/40 text-[#f4efe6] shadow-black/60 hover:border-[#c6a15b] hover:bg-[#1c1c18]/95 hover:shadow-[#c6a15b]/10"
            : "bg-[#141412]/75 border-white/10 text-[#8e8a82] shadow-black/40 hover:border-white/25 hover:text-[#c5c1b9] hover:bg-[#181816]/90"
        }`}
      >
        {/* Audio Icon */}
        <span
          className={`flex items-center justify-center transition-colors duration-200 ${
            soundEnabled ? "text-[#c6a15b]" : "text-[#8e8a82] group-hover:text-[#c5c1b9]"
          }`}
        >
          {soundEnabled ? (
            <Volume2 size={13} className="shrink-0 sm:w-3.5 sm:h-3.5" />
          ) : (
            <VolumeX size={13} className="shrink-0 sm:w-3.5 sm:h-3.5" />
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
                ? "h-2 bg-[#c6a15b]/70"
                : "h-1 bg-white/20"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              soundEnabled && isPlaying
                ? "bg-[#c6a15b] animate-soundbar-2"
                : soundEnabled
                ? "h-3 bg-[#c6a15b]/70"
                : "h-1 bg-white/20"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              soundEnabled && isPlaying
                ? "bg-[#c6a15b] animate-soundbar-3"
                : soundEnabled
                ? "h-1.5 bg-[#c6a15b]/70"
                : "h-1 bg-white/20"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              soundEnabled && isPlaying
                ? "bg-[#c6a15b] animate-soundbar-4"
                : soundEnabled
                ? "h-2.5 bg-[#c6a15b]/70"
                : "h-1 bg-white/20"
            }`}
          />
        </div>

        {/* Status Text: SOUND ON / SOUND OFF */}
        <span
          className={`text-[9.5px] sm:text-[10.5px] font-sans font-medium tracking-[0.16em] uppercase transition-colors duration-200 ${
            soundEnabled
              ? "text-[#c6a15b]"
              : "text-[#8e8a82] group-hover:text-[#c5c1b9]"
          }`}
        >
          {soundEnabled ? "SOUND ON" : "SOUND OFF"}
        </span>

        {/* Subtle Status Glow Dot */}
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            soundEnabled
              ? "bg-[#c6a15b] shadow-[0_0_6px_rgba(198,161,91,0.85)]"
              : "bg-white/15"
          }`}
          aria-hidden="true"
        />
      </button>
    </aside>
  );
}
