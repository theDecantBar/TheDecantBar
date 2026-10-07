export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block border border-white/10 bg-[#11110f]/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#c5c1b9] backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
}
