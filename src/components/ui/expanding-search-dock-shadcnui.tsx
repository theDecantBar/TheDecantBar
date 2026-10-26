import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRef, useState, type FormEvent, type KeyboardEventHandler } from "react";

type ExpandingSearchDockProps = {
  onSearch?: (query: string) => void;
  placeholder?: string;
  value?: string;
  onQueryChange?: (query: string) => void;
  onClear?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

export function ExpandingSearchDock({ onSearch, placeholder = "Search...", value, onQueryChange, onClear, onKeyDown }: ExpandingSearchDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const query = value ?? localQuery;
  const expanded = isExpanded || Boolean(query);
  function change(next: string) { setLocalQuery(next); onQueryChange?.(next); }
  function collapse() {
    setIsExpanded(false); change("");
    if (onClear) onClear();
    else if (query) onSearch?.("");
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSearch?.(query.trim()); }
  return <div className="pointer-events-none relative flex w-full max-w-[320px] min-w-0 justify-end">
    <AnimatePresence mode="wait" onExitComplete={() => { if (!expanded) trigger.current?.focus(); }}>
      {!expanded ? <motion.button ref={trigger} key="icon" type="button" aria-label="Open fragrance search" aria-expanded={false}
        initial={{ scale: reduceMotion ? 1 : 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: reduceMotion ? 1 : 0, opacity: 0 }}
        onClick={() => setIsExpanded(true)} className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-[#c6a15b] transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a15b]">
        <Search className="h-5 w-5" aria-hidden="true" />
      </motion.button> : <motion.form key="input" role="search" aria-label="Search fragrances" initial={{ width: reduceMotion ? "100%" : 48, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} exit={{ width: reduceMotion ? "100%" : 48, opacity: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }} onAnimationComplete={() => input.current?.focus()} onSubmit={submit} className="pointer-events-auto relative max-w-full">
        <motion.div initial={{ backdropFilter: "blur(0px)" }} animate={{ backdropFilter: "blur(12px)" }} className="relative flex items-center gap-2 overflow-hidden rounded-full border border-border bg-card/80 text-[#f4efe6] backdrop-blur-md focus-within:border-[#c6a15b]">
          <button type="submit" aria-label="Search fragrances" className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#c6a15b] hover:bg-muted"><Search className="h-4 w-4" aria-hidden="true" /></button>
          <input ref={input} type="search" aria-label="Fragrance name" value={query} onChange={event => change(event.target.value)} onKeyDown={event => { onKeyDown?.(event); if (event.key === "Escape") { event.preventDefault(); collapse(); } }} placeholder={placeholder} className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden" />
          <motion.button type="button" aria-label="Close and clear search" onClick={collapse} initial={{ scale: reduceMotion ? 1 : 0 }} animate={{ scale: 1 }} whileHover={{ scale: reduceMotion ? 1 : 1.1 }} whileTap={{ scale: reduceMotion ? 1 : 0.9 }} className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-muted"><X className="h-4 w-4" aria-hidden="true" /></motion.button>
        </motion.div>
      </motion.form>}
    </AnimatePresence>
  </div>;
}
