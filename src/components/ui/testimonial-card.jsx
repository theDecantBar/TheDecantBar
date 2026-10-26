import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Star, Pencil, Trash2, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function ReviewPhotoDialog({ photo, authorName, onClose }) {
  const dialog = useRef(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(
    <dialog ref={dialog} aria-label={`Review photo from ${authorName}`} onCancel={event => { event.preventDefault(); close.current(); }} onClick={event => { if (event.target === event.currentTarget) close.current(); }} className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-3xl overflow-visible rounded-2xl border border-white/20 bg-[#171715] p-4 text-[#f4efe6] shadow-2xl backdrop:bg-black/85 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-4"><p className="text-sm">Photo shared by {authorName}</p><button type="button" autoFocus aria-label="Close photo preview" onClick={onClose} className="rounded-full p-2 text-[#f4efe6] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#c6a15b]"><X size={20} /></button></div>
      <img src={photo} alt={`Review photo from ${authorName}`} className="max-h-[72dvh] w-full rounded-lg bg-[#11110f] object-contain" />
    </dialog>, document.body,
  );
}

export function TestimonialCard({ author, text, fragrance, rating = 5, date, photo, canModify = false, onEdit, onDelete, isEdited = false, editedByAdmin = false, href, className }) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const Card = href ? "a" : "div";
  const name = author?.name || "Customer";
  const initials = name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
  return <>
    <div className={cn("group/card relative h-[240px] w-full shrink-0 rounded-[22px] border border-white/15 bg-[#171714] p-1.5 shadow-2xl transition-all duration-300 hover:border-[#c6a15b]/50 hover:shadow-[0_0_25px_rgba(198,161,91,0.12)] sm:p-2", className)}>
      <Card {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})} className="flex h-full min-h-0 flex-col gap-2 rounded-[18px] border border-white/10 bg-[#121210] p-4 text-start transition-colors duration-300 group-hover/card:border-white/20">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3"><Avatar className="h-9 w-9 shrink-0 border border-white/10">{author?.avatar && <AvatarImage src={author.avatar} alt={name} />}<AvatarFallback>{initials}</AvatarFallback></Avatar><div className="min-w-0"><h3 className="max-w-[140px] truncate text-xs font-semibold leading-tight text-[#f4efe6] sm:text-sm">{name}</h3><p className="mt-1 max-w-[140px] truncate text-[11px] text-[#8e8a82]">{author?.handle || author?.city || "Customer"}</p></div></div>
          {canModify && <div className="flex shrink-0 gap-1 text-[#8e8a82]">{onEdit && <button type="button" aria-label={`Edit review by ${name}`} onClick={event => { event.preventDefault(); event.stopPropagation(); onEdit(); }} className="rounded p-1 transition hover:bg-white/5 hover:text-[#c6a15b]"><Pencil size={13} /></button>}{onDelete && <button type="button" aria-label={`Delete review by ${name}`} onClick={event => { event.preventDefault(); event.stopPropagation(); onDelete(); }} className="rounded p-1 transition hover:bg-white/5 hover:text-red-400"><Trash2 size={13} /></button>}</div>}
        </div>
        <div className="flex min-h-5 shrink-0 flex-wrap items-center gap-2"><div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-0.5 text-[#c6a15b]">{[1,2,3,4,5].map(star => <Star key={star} size={12} fill={star <= rating ? "currentColor" : "none"} aria-hidden="true" />)}</div>{fragrance && <span title={fragrance} className="max-w-[170px] truncate rounded border border-[#c6a15b]/30 bg-[#c6a15b]/5 px-2 py-0.5 text-[10px] font-semibold text-[#c6a15b]">{fragrance}</span>}</div>
        <div className="flex min-h-0 flex-1 items-start gap-3 overflow-hidden">
          <p className="line-clamp-3 min-w-0 flex-1 break-words text-xs italic leading-5 text-[#c5c1b9] sm:text-[13px]">&quot;{text}&quot;</p>
          {photo && <button type="button" aria-label="Open customer review photo" onClick={event => { event.preventDefault(); event.stopPropagation(); setPhotoOpen(true); }} className="group/img flex shrink-0 flex-col items-center gap-1 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a15b]"><img src={photo} alt={`Thumbnail of ${name}'s review photo`} loading="lazy" className="h-12 w-12 rounded-lg border border-white/15 object-cover transition group-hover/img:border-[#c6a15b]/60" /><span className="inline-flex items-center gap-1 text-[9px] text-[#c6a15b]"><ImageIcon size={10} />View</span></button>}
        </div>
        <div className="mt-auto flex shrink-0 items-center justify-between gap-2 border-t border-white/10 pt-2 text-[10px] text-[#8e8a82]"><span>{date}{isEdited ? (editedByAdmin ? " · Edited by admin" : " · Edited") : ""}</span><span className="font-mono text-[9px] text-[#c6a15b]/80">The Decant Bar</span></div>
      </Card>
    </div>
    {photoOpen && photo && <ReviewPhotoDialog photo={photo} authorName={name} onClose={() => setPhotoOpen(false)} />}
  </>;
}
export default TestimonialCard;
