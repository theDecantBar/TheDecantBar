import { useEffect, useId, useRef, useState } from "react";
import { Star, X, Camera, Upload, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

async function preparePhoto(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose a photo under 5MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL("image/jpeg", 0.78);
    if (result.length > 1398104) throw new Error("Photo is still too large. Please choose a smaller image.");
    return result;
  } finally { bitmap.close(); }
}
export default function ReviewForm({ review, user, isAuthenticated, onSave, onClose }) {
  const prefix = useId(); const photoInput = useRef(null); const dialog = useRef(null); const savingRef = useRef(false); const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const [form, setForm] = useState({ rating: review?.rating || 0, text: review?.text || "", city: review?.city || user?.city || "", fragrance: review?.fragrance || "", photo: review?.photo || null });
  const [photoName, setPhotoName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false); const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const previous = document.activeElement; const overflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    dialog.current?.focus();
    function keys(event) {
      if (event.key === "Escape" && !savingRef.current) closeRef.current();
      if (event.key !== "Tab") return;
      const items = [...dialog.current.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", keys);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", keys); previous?.focus(); };
  }, []);
  async function submit(event) {
    event.preventDefault(); if (savingRef.current || processing) return;
    if (!form.rating) { setError("Choose a star rating before submitting."); return; }
    if (!form.text.trim()) { setError("Please write your review."); return; }
    savingRef.current = true; setSaving(true); setError("");
    try { await onSave({ ...form, text: form.text.trim() }); }
    catch (err) { setError(err.message); }
    finally { savingRef.current = false; setSaving(false); }
  }
  const name = review?.name || user?.fullName || "Customer";
  const inputClass = "w-full rounded-lg border border-white/15 bg-[#11110f] px-3.5 py-2.5 text-xs text-[#f4efe6] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]";
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onMouseDown={e => { if (e.target === e.currentTarget && !saving) onClose(); }}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={`${prefix}-title`} tabIndex={-1} className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#171715] p-6 text-[#f4efe6] shadow-2xl sm:p-8">
      <button type="button" aria-label="Close review form" disabled={saving} onClick={onClose} className="absolute right-4 top-4 rounded-2xl p-2 hover:bg-white/10"><X size={20} /></button>
      <h2 id={`${prefix}-title`} className="font-display text-2xl pr-8">{review ? "Edit review" : "Share your experience"}</h2>
      {!isAuthenticated ? <div className="space-y-5 py-6"><p className="text-[#c5c1b9]">Sign in to share your experience. Store, WhatsApp and website customers are all welcome.</p><Link to="/login?redirect=/reviews" className="inline-block rounded-full bg-[#c6a15b] px-6 py-3 font-semibold text-[#11110f]">Sign in to review</Link></div> :
      <form onSubmit={submit} className="mt-5 space-y-4">
        <p className="text-sm text-[#c5c1b9]">{review ? `Review by ${name}` : `Posting as ${name}. No website purchase is required.`}</p>
        <fieldset disabled={saving || processing} className="space-y-4">
          <div><p className="mb-2 text-sm font-medium">Your rating</p><div role="group" aria-label="Choose a star rating" className="flex gap-1">{[1,2,3,4,5].map(star => <button key={star} type="button" aria-label={`${star} ${star === 1 ? "star" : "stars"}`} aria-pressed={form.rating === star} onClick={() => setForm({ ...form, rating: star })} className="rounded-2xl p-2 text-[#c6a15b] focus:ring-2 focus:ring-[#c6a15b]"><Star size={22} fill={star <= form.rating ? "currentColor" : "none"} /></button>)}</div><span className="text-sm text-[#c5c1b9]">{form.rating ? `${form.rating} out of 5` : "Select 1 to 5 stars"}</span></div>
          <div><label htmlFor={`${prefix}-fragrance`} className="mb-1.5 block text-xs uppercase tracking-wider text-[#c5c1b9]">Fragrance or product <span className="text-[#b6b2a8]">(optional)</span></label><input id={`${prefix}-fragrance`} maxLength={255} value={form.fragrance} onChange={e => setForm({ ...form, fragrance: e.target.value })} placeholder="e.g. Dior Sauvage 5ml" className={inputClass} /></div>
          <div><label htmlFor={`${prefix}-city`} className="mb-1.5 block text-xs uppercase tracking-wider text-[#c5c1b9]">City <span className="text-[#b6b2a8]">(optional)</span></label><input id={`${prefix}-city`} maxLength={100} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} /></div>
          <div><label htmlFor={`${prefix}-text`} className="mb-1.5 block text-xs uppercase tracking-wider text-[#c5c1b9]">Your review</label><textarea id={`${prefix}-text`} required maxLength={2000} rows={4} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="Tell us about the fragrance, packaging or your experience." className={inputClass} /><p className="mt-1 text-right text-xs text-[#b6b2a8]">{form.text.length}/2000</p></div>
          <div>
            <p id={`${prefix}-photo-label`} className="mb-2 flex items-center gap-2 text-sm font-medium"><Camera size={16} aria-hidden="true" /> Add a photo <span className="font-normal text-[#b6b2a8]">(optional)</span></p>
            <input
              ref={photoInput}
              id={`${prefix}-photo`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Choose review photo"
              aria-describedby={`${prefix}-photo-help`}
              className="rounded-2xl hidden"
              onChange={async event => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                if (!file) return;
                setProcessing(true); setPhotoError("");
                try {
                  const photo = await preparePhoto(file);
                  setForm(previous => ({ ...previous, photo }));
                  setPhotoName(file.name);
                } catch (err) { setPhotoError(err.message); }
                finally { setProcessing(false); }
              }}
            />
            <div aria-labelledby={`${prefix}-photo-label`} aria-busy={processing} className={`rounded-2xl border bg-[#11110f] p-4 ${form.photo ? "border-[#c6a15b]/35" : "border-dashed border-white/25"}`}>
              {processing ? <p role="status" className="py-5 text-center text-sm text-[#d8c08a]">Preparing your photo...</p> : form.photo ? (
                <div className="flex flex-col gap-4 min-[400px]:flex-row min-[400px]:items-center">
                  <img src={form.photo} alt="Selected review photo" className="h-24 w-24 shrink-0 rounded-lg border border-white/15 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#f4efe6]">Photo added</p>
                    {photoName && <p className="mt-1 break-all text-xs text-[#b6b2a8]">{photoName}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => photoInput.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#c6a15b]/60 px-4 py-2 text-xs text-[#d8c08a] transition hover:bg-[#c6a15b]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a15b]"><Upload size={14} aria-hidden="true" /> Replace photo</button>
                      <button type="button" onClick={() => { setForm(previous => ({ ...previous, photo: null })); setPhotoName(""); setPhotoError(""); }} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-[#c5c1b9] transition hover:border-red-400/50 hover:text-red-300"><Trash2 size={14} aria-hidden="true" /> Remove</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c6a15b]/10 text-[#c6a15b]"><Camera size={20} aria-hidden="true" /></span>
                  <div><p className="text-sm text-[#f4efe6]">Share a photo of your fragrance or packaging</p><p className="mt-1 text-xs text-[#b6b2a8]">Choose an image from your device.</p></div>
                  <button type="button" onClick={() => photoInput.current?.click()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#c6a15b] bg-[#221d15] px-5 py-2.5 text-sm font-medium text-[#d8c08a] transition hover:bg-[#c6a15b] hover:text-[#11110f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a15b]"><Upload size={16} aria-hidden="true" /> Browse photos</button>
                </div>
              )}
            </div>
            <p id={`${prefix}-photo-help`} className="mt-2 text-xs leading-5 text-[#b6b2a8]">JPG, PNG or WebP · Maximum 5MB · One photo per review</p>
            {photoError && <p role="alert" className="mt-2 text-sm text-red-200">{photoError}</p>}
          </div>
        </fieldset>
        {error && <p role="alert" className="rounded-lg border border-red-400/30 p-3 text-sm text-red-200">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-white/10 pt-5"><button type="button" disabled={saving} onClick={onClose} className="rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-wider">Cancel</button><button type="submit" disabled={saving || processing} className="rounded-full bg-[#c6a15b] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#11110f] disabled:opacity-50">{processing ? "Preparing photo…" : saving ? "Saving…" : review ? "Save changes" : "Submit review"}</button></div>
      </form>}
    </div>
  </div>;
}
