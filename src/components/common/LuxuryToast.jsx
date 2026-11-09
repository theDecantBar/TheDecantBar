import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LuxuryToast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isWarning = toast.type === "warning";
          const isError = toast.type === "error";

          return (
            <motion.div
              key={toast.id}
              role="alert"
              initial={{ opacity: 0, y: -16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto relative flex items-start gap-3 rounded-2xl border p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-white/10 backdrop-blur-md ${
                isError
                  ? "border-red-500/40 bg-[#181111]/95 text-[#fcedec]"
                  : isWarning
                  ? "border-amber-500/40 bg-[#181510]/95 text-[#fdf6ec]"
                  : "border-[#c6a15b]/45 bg-[#161613]/95 text-[#f4efe6]"
              }`}
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {isSuccess && (
                  <CheckCircle2 size={17} className="text-[#c6a15b]" />
                )}
                {isWarning && (
                  <AlertTriangle size={17} className="text-amber-400" />
                )}
                {isError && (
                  <AlertCircle size={17} className="text-red-400" />
                )}
                {!isSuccess && !isWarning && !isError && (
                  <Sparkles size={17} className="text-[#c6a15b]" />
                )}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs sm:text-[13px] font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-[#8e8a82] hover:text-[#f4efe6] transition p-0.5 rounded cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

