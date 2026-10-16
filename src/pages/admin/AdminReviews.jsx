import { useState, useEffect } from "react";
import { Star, Trash2, CheckCircle2, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminReviews, deleteAdminReview } from "../../services/adminApi";

export default function AdminReviews() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function loadReviews() {
      try {
        const data = await fetchAdminReviews(token);
        if (!ignore) {
          setReviews(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load reviews");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (token) {
      loadReviews();
    }

    return () => {
      ignore = true;
    };
  }, [token]);


  const handleDelete = async (id, author) => {
    if (!window.confirm(`Delete review from "${author}"?`)) return;
    try {
      await deleteAdminReview(token, id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
          Customer Feedback
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[#f4efe6] mt-1">
          Reviews Moderation
        </h1>
        <p className="text-xs text-[#8e8a82] mt-1">
          View verified customer ratings and moderate public testimonials.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent mb-3" />
          <p className="text-xs uppercase tracking-wider text-[#8e8a82]">
            Loading reviews...
          </p>
        </div>
      ) : error ? (
        <div className="border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-300">
          <p>{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="border border-white/10 bg-[#171715] p-12 text-center text-[#8e8a82]">
          <MessageSquare size={36} strokeWidth={1.2} className="mx-auto text-[#c6a15b] mb-3" />
          <p className="text-sm text-[#f4efe6]">No customer reviews submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="border border-white/10 bg-[#171715] p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#c6a15b]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < (r.rating || 5) ? "#c6a15b" : "none"}
                        className={i < (r.rating || 5) ? "text-[#c6a15b]" : "text-white/20"}
                      />
                    ))}
                  </div>
                  {r.verified_buyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                      <CheckCircle2 size={12} /> Verified Buyer
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-[#f4efe6]">
                  {r.fragrance}
                </p>

                <p className="text-xs text-[#c5c1b9] italic leading-relaxed">
                  "{r.review_text}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#f4efe6]">{r.author_name}</p>
                  <p className="text-[11px] text-[#8e8a82]">
                    {r.city || "India"} {r.order_number ? `· Order #${r.order_number}` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(r.id, r.author_name)}
                  className="p-2 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
