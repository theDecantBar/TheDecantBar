import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchAllReviews, fetchManageableReviewIds, editReview, removeReview } from "../../services/reviewApi";
import TestimonialCard from "../../components/ui/testimonial-card";
import ReviewForm from "../../components/home/ReviewForm";
export default function AdminReviews() {
  const { user, token, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]); const [ids, setIds] = useState([]); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); const [editing, setEditing] = useState(null); const [busyId, setBusyId] = useState(null);
  useEffect(() => {
    let ignore = false;
    Promise.all([fetchAllReviews(), fetchManageableReviewIds(token)]).then(([data, permissions]) => { if (!ignore) { setReviews(data); setIds(permissions); } }).catch(err => { if (!ignore) setError(err.message); }).finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [token]);
  async function save(body) {
    const saved = await editReview(editing.id, body, token);
    setReviews(prev => prev.map(review => String(review.id) === String(saved.id) ? saved : review)); setEditing(null);
  }
  async function destroy(review) {
    if (!window.confirm(`Remove the review by ${review.name} from the website?`)) return;
    setBusyId(review.id); setError("");
    try { await removeReview(review.id, token); setReviews(prev => prev.filter(item => String(item.id) !== String(review.id))); }
    catch (err) { setError(err.message); }
    finally { setBusyId(null); }
  }
  return <div className="space-y-7"><div><p className="text-xs uppercase tracking-[0.2em] text-[#c6a15b]">Customer feedback</p><h1 className="mt-2 font-display text-4xl text-[#f4efe6]">Reviews moderation</h1><p className="mt-3 text-sm text-[#c5c1b9]">Review customer feedback. Edits keep the original author and show an admin edit label. Deleted reviews leave public pages.</p></div>{error && <p role="alert" className="text-red-200">{error}</p>}{loading ? <p role="status">Loading reviews…</p> : !reviews.length ? <p>No customer reviews yet.</p> : <div className="grid gap-5 md:grid-cols-2">{reviews.map(review => <div key={review.id} aria-busy={busyId === review.id} className={busyId === review.id ? "pointer-events-none opacity-60" : ""}><TestimonialCard {...review} author={{ name: review.name, city: review.city }} canModify={ids.some(id => String(id) === String(review.id))} onEdit={() => setEditing(review)} onDelete={() => destroy(review)} /></div>)}</div>}{editing && <ReviewForm review={editing} user={user} isAuthenticated={isAuthenticated} onSave={save} onClose={() => setEditing(null)} />}</div>;
}
