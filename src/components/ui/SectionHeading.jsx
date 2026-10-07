import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function SectionHeading({
  eyebrow,
  title,
  actionText,
  actionHref,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col justify-between gap-4 md:flex-row md:items-end ${className}`}
    >
      <div>
        {eyebrow && (
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="font-display text-3xl tracking-tight text-[#f4efe6] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="group inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#c5c1b9] transition-colors hover:text-[#c6a15b]"
        >
          <span>{actionText}</span>
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      )}
    </div>
  );
}
