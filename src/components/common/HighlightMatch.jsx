export default function HighlightMatch({ text = "", query = "" }) {
  if (!text) return null;
  if (!query || !query.trim()) return <>{text}</>;

  const words = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (words.length === 0) return <>{text}</>;

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        const isMatch = words.some((w) =>
          new RegExp(`^${w}$`, "i").test(part)
        );
        return isMatch ? (
          <span
            key={index}
            className="font-semibold text-[#c6a15b] underline decoration-[#c6a15b]/40 underline-offset-2"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
}
