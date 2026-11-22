import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "decantbar_sound_preference";
const DEFAULT_VOLUME = 0.25; // Subtle 25% volume (20-30% range)

const AudioContext = createContext(null);

// Module-level singleton to guarantee exactly one Audio instance across the runtime
let globalAudio = null;

function getGlobalAudio() {
  if (typeof window === "undefined") return null;
  if (!globalAudio) {
    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = DEFAULT_VOLUME;

    // Use clean audio endpoint with fallback to original filename
    audio.src = "/audio/refined-atmosphere.mp3";

    audio.addEventListener("error", () => {
      // Fallback if refined-atmosphere.mp3 fails to load
      if (audio.src && !audio.src.includes("Refined") && !audio.src.includes("mpeg")) {
        audio.src = "/audio/Refined%20Atmosphere.mp3.mpeg";
        try {
          const pref = localStorage.getItem(STORAGE_KEY);
          if (pref !== "disabled") {
            audio.play().catch(() => {});
          }
        } catch {
          // Ignore storage errors
        }
      }
    });

    globalAudio = audio;
  }
  return globalAudio;
}

export function AudioProvider({ children }) {
  // Check localStorage for saved user choice.
  // Returns true (enabled) by default unless user explicitly chose "disabled".
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "disabled") return false;
      if (saved === "enabled") return true;
      return true; // Default to enabled
    } catch {
      return true;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Initialize audio and synchronize state
  useEffect(() => {
    const audio = getGlobalAudio();
    if (!audio) return;

    // Sync playing state with native audio events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (soundEnabledRef.current) {
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("playing", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Initial check: if sound is disabled, ensure audio is paused
    if (!soundEnabled) {
      if (!audio.paused) {
        audio.pause();
      }
      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("playing", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }

    // Sound is enabled: attempt playback
    let interactionCleanup = null;

    const attemptPlay = () => {
      if (!soundEnabledRef.current) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // handlePlay event listener sets isPlaying to true
          })
          .catch(() => {
            // Browser autoplay restrictions blocked audio
            // Register one-time user interaction listeners to start audio upon first click/tap/keypress
            const onFirstUserGesture = () => {
              if (soundEnabledRef.current && audio.paused) {
                audio.play().catch(() => {});
              }
              cleanupListeners();
            };

            const cleanupListeners = () => {
              window.removeEventListener("click", onFirstUserGesture);
              window.removeEventListener("touchstart", onFirstUserGesture);
              window.removeEventListener("keydown", onFirstUserGesture);
              interactionCleanup = null;
            };

            window.addEventListener("click", onFirstUserGesture, { passive: true, once: true });
            window.addEventListener("touchstart", onFirstUserGesture, { passive: true, once: true });
            window.addEventListener("keydown", onFirstUserGesture, { passive: true, once: true });

            interactionCleanup = cleanupListeners;
          });
      }
    };

    attemptPlay();

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("playing", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      if (interactionCleanup) {
        interactionCleanup();
      }
    };
  }, [soundEnabled]);

  // Toggle function called by UI button or keyboard shortcut
  const toggleSound = useCallback(() => {
    const audio = getGlobalAudio();
    if (!audio) return;

    setSoundEnabled((prev) => {
      const next = !prev;

      // Persist user preference to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, next ? "enabled" : "disabled");
      } catch {
        // Safe fallback for restricted environments
      }

      if (next) {
        // User explicitly turned ON: resume playback from current position
        audio.play().catch((err) => {
          console.warn("Audio playback prevented:", err);
        });
      } else {
        // User explicitly turned OFF: pause audio immediately
        audio.pause();
      }

      return next;
    });
  }, []);

  return (
    <AudioContext.Provider value={{ soundEnabled, isPlaying, toggleSound }}>
      {children}
    </AudioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
