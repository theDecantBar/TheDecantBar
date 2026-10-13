import { Star, CheckCircle, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialCard({
  author,
  text,
  fragrance,
  rating = 5,
  date,
  photo,
  verifiedBuyer = true,
  canModify = false,
  onEdit,
  onDelete,
  onPhotoClick,
  href,
  className,
}) {
  const Card = href ? "a" : "div";
  const initials = author?.name
    ? author.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "DB";

  return (
    <div
      className={cn(
        "group/card relative rounded-[22px] border border-white/15 bg-[#171714] p-1.5 sm:p-2 shadow-2xl",
        "transition-all duration-300 hover:border-[#c6a15b]/50 hover:shadow-[0_0_25px_rgba(198,161,91,0.12)]",
        "w-[310px] sm:w-[360px] shrink-0 select-none",
        className
      )}
    >
      <Card
        {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
        className="flex h-full flex-col justify-between rounded-[18px] border border-white/10 bg-[#121210] p-5 sm:p-6 text-start transition-colors duration-300 group-hover/card:border-white/20"
      >
      <div>
        {/* Top Header: Avatar + Author Info + Actions */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 shrink-0 border border-white/10">
              {author?.avatar && <AvatarImage src={author.avatar} alt={author.name} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold leading-tight text-[#f4efe6] truncate max-w-[140px]">
                {author?.name || "Customer"}
              </h3>
              <p className="text-[11px] text-[#8e8a82] truncate max-w-[140px]">
                {author?.handle || author?.city || "Verified Buyer"}
              </p>
            </div>
          </div>

          {/* Author Edit / Delete */}
          {canModify && (
            <div className="flex items-center gap-1 text-[#8e8a82] shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1 rounded hover:text-[#c6a15b] hover:bg-white/5 transition cursor-pointer"
                  title="Edit your review"
                >
                  <Pencil size={13} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1 rounded hover:text-red-400 hover:bg-white/5 transition cursor-pointer"
                  title="Delete your review"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stars + Fragrance Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5 text-[#c6a15b]">
            {[...Array(Number(rating) || 5)].map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>

          {fragrance && (
            <span className="text-[10px] font-semibold text-[#c6a15b] border border-[#c6a15b]/30 bg-[#c6a15b]/5 px-2 py-0.5 rounded truncate max-w-[170px]">
              {fragrance}
            </span>
          )}

          {verifiedBuyer && (
            <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              <CheckCircle size={9} />
              Verified
            </span>
          )}
        </div>

        {/* Review text */}
        <p className="text-xs sm:text-[13px] text-[#c5c1b9] leading-relaxed italic line-clamp-4 mb-3">
          "{text}"
        </p>

        {/* Optional Photo Thumbnail */}
        {photo && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPhotoClick && onPhotoClick(photo);
            }}
            className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[#11110f] cursor-pointer group/img mb-3"
          >
            <img
              src={photo}
              alt={`${author?.name}'s review`}
              className="h-full w-full object-cover transition duration-300 group-hover/img:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition group-hover/img:opacity-100 flex items-center justify-center text-[10px] text-white gap-1">
              <ImageIcon size={12} />
              <span>View Photo</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Date / Order info */}
      {date && (
        <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[10px] text-[#8e8a82]">
          <span>{date}</span>
          <span className="text-[#c6a15b]/80 font-mono text-[9px]">The Decant Bar</span>
        </div>
      )}
      </Card>
    </div>
  );
}
export default TestimonialCard;
