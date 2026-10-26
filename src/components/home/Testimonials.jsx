import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Star, MessageSquarePlus } from "lucide-react";
import Container from "../ui/Container";
import TestimonialCard from "../ui/testimonial-card";
import ReviewForm from "./ReviewForm";
import { useAuth } from "../../context/AuthContext";
import { fetchAllReviews, fetchManageableReviewIds, submitReview, editReview, removeReview } from "../../services/reviewApi";
import "./Testimonials.css";

function DeleteReviewDialog({ review, onClose, onDelete }) {
  const element = useRef(null); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  useEffect(() => { const previous = document.activeElement; element.current.showModal(); return () => { previous?.focus(); }; }, []);
  return <dialog ref={element} aria-labelledby="delete-review-title" onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/20 bg-[#171715] p-7 text-[#f4efe6] backdrop:bg-black/80">
    <h2 id="delete-review-title" className="font-display text-3xl">Delete this review?</h2><p className="mt-3 text-sm leading-6 text-[#c5c1b9]">The review by {review.name} will be removed from the homepage and Reviews page.</p>
    {error && <p role="alert" className="mt-3 text-sm text-red-200">{error}</p>}
    <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={busy} onClick={onClose} className="rounded-full border border-white/20 px-5 py-3 text-sm">Keep review</button><button type="button" disabled={busy} onClick={async () => { setBusy(true); setError(""); try { await onDelete(); } catch (err) { setError(err.message); setBusy(false); } }} className="rounded-full bg-[#c6a15b] px-5 py-3 text-sm font-semibold text-[#11110f]">{busy ? "Deleting..." : "Delete review"}</button></div>
  </dialog>;
}
export default function Testimonials({ showBreadcrumb = false }) {
  const { user, token, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]); const [permissions, setPermissions] = useState({ token: null, ids: [] });
  const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all"); const [sort, setSort] = useState("newest");
  const [modal, setModal] = useState(null); const [deleting, setDeleting] = useState(null);
  const [geometry, setGeometry] = useState({ width: 1000, card: 360, height: 240 });
  const viewport = useRef(null); const channel = useRef(null); const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const current = ++sequence.current;
    try {
      const data = await fetchAllReviews();
      if (current !== sequence.current) return;
      setReviews(data); setError("");
      if (token) {
        try { const ids = await fetchManageableReviewIds(token); if (current === sequence.current) setPermissions({ token, ids }); }
        catch { if (current === sequence.current) setPermissions({ token, ids: [] }); }
      }
    } catch (err) { if (current === sequence.current) setError(err.message); }
    finally { if (current === sequence.current) setLoading(false); }
  }, [token]);
  useEffect(() => {
    const initial = window.setTimeout(refresh, 0); const focus = () => refresh();
    const visible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", focus); document.addEventListener("visibilitychange", visible);
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 60000);
    if (typeof BroadcastChannel !== "undefined") { channel.current = new BroadcastChannel("tdb-review-changes"); channel.current.onmessage = refresh; }
    return () => { clearTimeout(initial); window.removeEventListener("focus", focus); document.removeEventListener("visibilitychange", visible); clearInterval(timer); channel.current?.close(); channel.current = null; };
  }, [refresh]);
  useEffect(() => {
    const el = viewport.current; if (!el) return;
    const measure = () => {
      const cards = [...el.querySelectorAll(".review-slide")]; const width = el.clientWidth;
      const card = cards[0]?.getBoundingClientRect().width || 340;
      const height = Math.max(200, ...cards.map(item => item.scrollHeight));
      setGeometry(prev => prev.width === width && prev.card === card && prev.height === height ? prev : { width, card, height });
    };
    const observer = new ResizeObserver(measure); observer.observe(el); el.querySelectorAll(".review-slide").forEach(card => observer.observe(card)); measure();
    return () => observer.disconnect();
  }, [reviews, ratingFilter, sort, loading]);
  async function save(body) {
    const saved = modal?.id ? await editReview(modal.id, body, token) : await submitReview(body, token);
    sequence.current++;
    setReviews(prev => modal?.id ? prev.map(review => String(review.id) === String(saved.id) ? saved : review) : [saved, ...prev]);
    setPermissions(prev => ({ token, ids: [...new Set([...(prev.token === token ? prev.ids : []), saved.id])] }));
    setModal(null); setNotice(modal?.id ? "Review updated." : "Thank you. Your review is now published."); channel.current?.postMessage("changed");
  }
  async function deleteSelected() {
    await removeReview(deleting.id, token); sequence.current++;
    setReviews(prev => prev.filter(review => String(review.id) !== String(deleting.id))); setDeleting(null);
    setNotice("Review removed from the website."); channel.current?.postMessage("changed");
  }
  const filtered = reviews.filter(review => ratingFilter === "all" || Number(review.rating) === Number(ratingFilter)).sort((a, b) => sort === "highest" ? b.rating - a.rating : sort === "lowest" ? a.rating - b.rating : b.timestamp - a.timestamp);
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1) : null;
  const totalReviews = reviews.length;
  const averageRating = average || "No reviews yet";
  const ratingCounts = Object.fromEntries([1,2,3,4,5].map(star => [star, reviews.filter(review => Number(review.rating) === star).length]));
  const FILTER_TABS = [{ id: "all", label: "All Reviews" }, { id: "5", label: "5-Star Reviews" }];
  const gap = 16;
  const trackWidth = filtered.length * geometry.card + Math.max(0, filtered.length - 1) * gap;
  const start = geometry.width + gap;
  const distance = start + trackWidth + gap;
  const duration = Math.max(18, distance / 38);
  const initialOffset = Math.max(0, (geometry.width - trackWidth) / 2);
  const delay = -duration * (start - initialOffset) / distance;
  const canModify = review => Boolean(isAuthenticated && token && permissions.token === token && permissions.ids.some(id => String(id) === String(review.id)));
  return <section id="customer-reviews" aria-labelledby="customer-reviews-title" className="border-b border-white/10 bg-[#11110f] py-10 text-[#f4efe6] sm:py-24">
    <Container>
      {showBreadcrumb && <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#b6b2a8]"><Link to="/">Home</Link><span aria-hidden="true"> / </span>Reviews</nav>}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c6a15b] mb-2">
              Community Praise
            </p>
            <h2 id="customer-reviews-title" className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
              Customer Reviews & Ratings
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#8e8a82] max-w-xl">
              Authentic feedback, decant reviews, and photos from our customer community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setNotice("");
              setModal({});
            }}
            className="self-start sm:self-auto inline-flex items-center gap-2.5 rounded-full border border-[#c6a15b] bg-[#221d15] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#f4efe6] hover:bg-[#c6a15b] hover:text-[#11110f] transition shadow-lg cursor-pointer shrink-0"
          >
            <MessageSquarePlus size={15} className="text-[#c6a15b]" />
            <span>Write a Review</span>
          </button>
        </div>

      {notice && <p role="status" className="mb-5 rounded-lg border border-[#c6a15b]/40 p-3 text-sm text-[#d8c08a]">{notice}</p>}
      {error && <div role="alert" className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-red-400/30 p-4 text-sm text-red-200"><p>{error} {reviews.length ? "Previously loaded reviews may be out of date." : ""}</p><button type="button" onClick={refresh} className="rounded-2xl underline">Try again</button></div>}
      {loading ? <p role="status" className="py-12 text-[#c5c1b9]">Loading customer reviews...</p> : <>
        <div className="rounded-[24px] border border-white/15 bg-[#171714] p-2 sm:p-2.5 mb-8 shadow-2xl transition-all duration-300 hover:border-[#c6a15b]/40">
          <div className="rounded-[18px] border border-white/10 bg-[#121210] p-7 sm:p-9">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Big Average + Stars */}
              <div className="md:col-span-4 text-center md:text-left md:border-r border-white/10 md:pr-8">
                <div className="font-display text-6xl sm:text-7xl font-bold text-[#f4efe6] leading-none mb-3">
                  {averageRating}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-1 text-[#c6a15b] mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= Math.round(Number(averageRating)) ? "currentColor" : "none"}
                    />
                  ))}
                </div>

                <p className="text-xs text-[#8e8a82]">
                  Based on {totalReviews} customer {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Right Column: 5 Star Distribution Bars */}
              <div className="md:col-span-8 space-y-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-8 text-right font-medium text-[#c5c1b9] flex items-center justify-end gap-1">
                        {star} <Star size={11} className="fill-[#c6a15b] text-[#c6a15b]" />
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-[#c6a15b] rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-6 text-right font-mono text-[#8e8a82] text-[11px]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 2. Filter Tabs & Sorting Bar (Newest, High, Low)     */}
        {/* ---------------------------------------------------- */}
        <div className="rounded-2xl border border-white/10 bg-[#161613] p-3 sm:p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Simple Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = ratingFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRatingFilter(tab.id)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-[#c6a15b] text-[#11110f] font-semibold"
                      : "bg-[#1f1f1b] text-[#c5c1b9] hover:bg-white/10 hover:text-[#f4efe6]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto text-xs text-[#8e8a82]">
            {/* Sort Dropdown: Newest, Highest, Lowest */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-2xl border border-white/15 bg-[#1f1f1b] px-3 py-1.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {!filtered.length ? <p className="rounded-2xl border border-white/10 p-10 text-center text-[#c5c1b9]">{reviews.length ? "No reviews match this rating. Try all ratings." : "No customer reviews yet. Share your experience with us."}</p> :
          <div ref={viewport} role="region" aria-label={`${filtered.length} customer reviews`} className={`review-viewport ${modal || deleting ? "is-paused" : ""}`} style={{ height: geometry.height + 16, "--review-start": `${start}px`, "--review-end": `${-trackWidth - gap}px` }}>
            <div className="review-track" key={`${ratingFilter}-${sort}-${filtered.map(review => review.id).join("-")}`} style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
            {filtered.map(review => <div key={review.id} className="review-slide"><TestimonialCard author={{ name: review.name, city: review.city }} {...review} canModify={canModify(review)} onEdit={() => setModal(review)} onDelete={() => setDeleting(review)} /></div>)}
            </div>
          </div>}
        {!showBreadcrumb && <div className="mt-6 text-center"><Link to="/reviews" className="text-sm text-[#d8c08a] underline underline-offset-4">Read all customer reviews</Link></div>}
      </>}
      {modal && <ReviewForm key={modal.id || "new"} review={modal.id ? modal : null} user={user} isAuthenticated={isAuthenticated} onSave={save} onClose={() => setModal(null)} />}
      {deleting && <DeleteReviewDialog review={deleting} onClose={() => setDeleting(null)} onDelete={deleteSelected} />}
    </Container>
  </section>;
}
