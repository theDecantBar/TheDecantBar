
import { useState, useEffect, useCallback } from "react";
import { Star, Trash2, Pencil, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProductReviews({ productId }) {
  const { token, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
  });

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const myReview = reviews.find((review) => review.is_mine);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/product-reviews/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load reviews.");
      }

      setReviews(data.reviews || []);
      setAverageRating(Number(data.average_rating || 0));
      setReviewCount(Number(data.review_count || 0));

      setRatingDistribution({
        5: Number(data.rating_distribution?.[5] ?? data.rating_distribution?.five_star ?? 0),
        4: Number(data.rating_distribution?.[4] ?? data.rating_distribution?.four_star ?? 0),
        3: Number(data.rating_distribution?.[3] ?? data.rating_distribution?.three_star ?? 0),
        2: Number(data.rating_distribution?.[2] ?? data.rating_distribution?.two_star ?? 0),
        1: Number(data.rating_distribution?.[1] ?? data.rating_distribution?.one_star ?? 0),
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [productId, token]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (myReview && !editingId) {
      setRating(myReview.rating);
      setReviewText(myReview.review_text);
    }
  }, [myReview, editingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isAuthenticated || !token) {
      setMessage("Please log in to submit a review.");
      return;
    }

    if (!reviewText.trim()) {
      setMessage("Please write your review.");
      return;
    }

    try {
      setSubmitting(true);

      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `/api/product-reviews/${editingId}`
        : `/api/product-reviews/${productId}`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          review_text: reviewText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit review.");
      }

      setMessage(data.message);
      setEditingId(null);
      await loadReviews();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setReviewText(review.review_text);
    setMessage("");
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      const response = await fetch(`/api/product-reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete review.");
      }

      setEditingId(null);
      setReviewText("");
      setRating(5);
      setMessage(data.message);
      await loadReviews();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="mt-12 border-t border-white/10 pt-10">

      {/* Heading and Average Rating */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c6a15b]">
            Customer Experiences
          </p>
          <h2 className="mt-2 font-display text-2xl text-[#f4efe6]">
            Perfume Reviews
          </h2>
        </div>

        <div className="rounded-xl border border-[#c6a15b]/30 bg-[#151512] px-4 py-3">
          <div className="flex items-center gap-2">
            <Star size={19} fill="#c6a15b" className="text-[#c6a15b]" />
            <span className="text-xl font-semibold text-[#f4efe6]">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-[#8e8a82]">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>
      

      {/* Rating Distribution */}
      {!loading && (
        <div className="mb-7 rounded-2xl border border-[#c6a15b]/25 bg-[#151512] p-5 sm:p-6">
          <h3 className="mb-5 text-sm font-semibold text-[#f4efe6]">
            Customer Rating Breakdown
          </h3>

          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0;
              const percentage = reviewCount > 0
                ? (count / reviewCount) * 100
                : 0;

              return (
                <div
                  key={star}
                  className="grid grid-cols-[45px_minmax(0,1fr)_35px] items-center gap-3"
                >
                  <span className="flex items-center gap-1.5 text-sm text-[#f4efe6]">
                    {star}
                    <Star size={14} fill="#c6a15b" className="text-[#c6a15b]" />
                  </span>

                  <div className="h-3 overflow-hidden rounded-full bg-[#34332f]">
                    <div
                      className="h-full rounded-full bg-[#c6a15b] transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="text-right text-sm font-medium text-[#f4efe6]">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] text-[#8e8a82]">
            Based on {reviewCount} customer {reviewCount === 1 ? "rating" : "ratings"}
          </p>
        </div>
      )}

      {/* Customer Reviews */}
      {loading ? (
        <p className="text-sm text-[#8e8a82]">Loading reviews...</p>
      ) : (
        <div className="space-y-5">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#151512] p-6 text-center">
              <Star className="mx-auto mb-2 text-[#c6a15b]" size={24} />
              <p className="text-sm text-[#f4efe6]">No reviews yet.</p>
              <p className="mt-1 text-xs text-[#8e8a82]">
                Be the first to share your experience with this fragrance.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-white/10 bg-[#151512] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#f4efe6]">
                      {review.customer_name || "Customer"}
                      {review.is_mine && (
                        <span className="ml-2 text-[10px] text-[#c6a15b]">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[10px] text-[#8e8a82]">
                      {new Date(review.created_at).toLocaleDateString()}
                      {review.is_edited && " · Edited"}
                    </p>
                  </div>

                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= review.rating ? "#c6a15b" : "none"}
                        className={star <= review.rating ? "text-[#c6a15b]" : "text-white/20"}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#c5c1b9]">
                  {review.review_text}
                </p>

                {review.is_mine && (
                  <div className="mt-4 flex gap-4 border-t border-white/10 pt-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(review)}
                      className="flex items-center gap-1.5 text-xs text-[#c6a15b] hover:text-[#f4efe6]"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      )}

      {/* Write a Review */}
      <div className="mt-8 rounded-2xl border border-[#c6a15b]/25 bg-[#151512] p-5 sm:p-6">
        <h3 className="font-display text-lg text-[#f4efe6]">
          {editingId ? "Edit Your Review" : myReview ? "Your Review" : "Share Your Experience"}
        </h3>

        {!isAuthenticated ? (
          <p className="mt-3 text-sm text-[#8e8a82]">
            Please log in to share your experience with this perfume.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-xs text-[#8e8a82]">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      size={25}
                      fill={star <= rating ? "#c6a15b" : "none"}
                      className={star <= rating ? "text-[#c6a15b]" : "text-white/30"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="What do you think about this fragrance?"
              className="w-full resize-y rounded-xl border border-white/15 bg-[#11110f] p-3 text-sm text-[#f4efe6] placeholder:text-[#77736c] focus:border-[#c6a15b] focus:outline-none"
              required
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] text-[#8e8a82]">
                {reviewText.length}/2000 characters
              </span>

              <div className="flex gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setReviewText(myReview?.review_text || "");
                      setRating(myReview?.rating || 5);
                    }}
                    className="rounded-xl border border-white/15 px-4 py-2 text-xs text-[#c5c1b9]"
                  >
                    Cancel
                  </button>
                )}

                {(!myReview || editingId) && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-[#c6a15b] px-5 py-2.5 text-xs font-semibold text-[#11110f] transition hover:bg-[#d8c08a] disabled:opacity-50"
                  >
                    <Send size={13} />
                    {submitting ? "Saving..." : editingId ? "Update Review" : "Submit Review"}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {message && (
          <p className="mt-3 text-xs text-[#c6a15b]" role="status">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
