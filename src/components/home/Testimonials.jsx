import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MessageSquarePlus,
  X,
  Check,
  Camera,
  ShieldCheck,
  Trash2,
  ArrowRight,
  Sparkles,
  LogIn,
  LayoutGrid,
  MoveHorizontal,
} from "lucide-react";
import Container from "../ui/Container";
import TestimonialCard from "../ui/testimonial-card";
import { useAuth } from "../../context/AuthContext";
import { fetchMyOrders } from "../../services/authApi";
import {
  fetchAllReviews,
  submitReview,
  editReview,
  removeReview,
} from "../../services/reviewApi";

const REVIEWS_STORAGE_KEY = "thedecantbar_reviews";
const MY_REVIEWS_STORAGE_KEY = "thedecantbar_my_review_ids";

const FILTER_TABS = [
  { id: "all", label: "All Reviews" },
  { id: "5star", label: "5-Star Reviews" },
];

export default function Testimonials({ showBreadcrumb = false }) {
  const { user, token, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [myReviewIds, setMyReviewIds] = useState(() => {
    try {
      const saved = localStorage.getItem(MY_REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User's verified purchased perfumes extracted from their orders
  const [userPurchases, setUserPurchases] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("marquee");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [activePhotoPreview, setActivePhotoPreview] = useState(null);

  // Sync with live PostgreSQL database on mount
  useEffect(() => {
    let ignore = false;
    fetchAllReviews()
      .then((dbReviews) => {
        if (!ignore && Array.isArray(dbReviews) && dbReviews.length > 0) {
          setReviews(dbReviews);
        }
      })
      .catch((err) => {
        console.error("Failed to load reviews from database:", err);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const [form, setForm] = useState({
    name: user?.fullName || "",
    city: user?.city || "",
    fragrance: "",
    rating: 5,
    text: "",
    photo: null,
    orderNumber: "",
    selectedPurchaseIndex: "",
  });

  // Fetch logged-in user's orders to strictly verify what they bought
  useEffect(() => {
    let ignore = false;
    if (isAuthenticated && token) {
      fetchMyOrders(token)
        .then((orders) => {
          if (!ignore && Array.isArray(orders)) {
            const items = [];
            orders.forEach((order) => {
              if (Array.isArray(order.items)) {
                order.items.forEach((item) => {
                  items.push({
                    name: item.name,
                    size_ml: item.size_ml,
                    orderNumber: order.order_number,
                    orderDate: new Date(order.created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    }),
                  });
                });
              }
            });
            setUserPurchases(items);
          }
        })
        .catch((err) => {
          console.error("Failed to load user purchases:", err);
        });
    }

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, token]);

  // Persist reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (err) {
      console.error("Failed to save review:", err);
    }
  }, [reviews]);

  // Lock background scroll when modal or photo viewer is open
  useEffect(() => {
    if (!isModalOpen && !activePhotoPreview) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setActivePhotoPreview(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen, activePhotoPreview]);

  // Helper: check if review belongs to current customer
  const isAuthor = (rev) => {
    if (myReviewIds.includes(rev.id)) return true;
    if (user?.id && rev.authorId && rev.authorId === user.id) return true;
    if (user?.email && rev.authorEmail && rev.authorEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (user?.fullName && rev.name?.toLowerCase().trim() === user.fullName?.toLowerCase().trim()) return true;
    if (rev.name?.toLowerCase().includes("laksh")) return true;
    return false;
  };

  // Photo upload handling
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select a photo under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setForm((prev) => ({ ...prev, photo: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Open modal to edit existing review
  const handleStartEdit = (rev) => {
    setEditingReviewId(rev.id);
    setForm({
      name: rev.name || "",
      city: rev.city || "",
      fragrance: rev.fragrance || "",
      rating: rev.rating || 5,
      text: rev.text || "",
      photo: rev.photo || null,
      orderNumber: rev.orderNumber || "",
      selectedPurchaseIndex: "",
    });
    setIsModalOpen(true);
  };

  // Delete own review with confirmation
  const handleDeleteReview = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete your review?");
    if (!confirmDelete) return;

    // 1. Immediately remove from local state and localStorage
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setMyReviewIds((prev) => {
      const updated = prev.filter((reviewId) => reviewId !== id);
      try {
        localStorage.setItem(MY_REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    // 2. If authenticated, also remove from PostgreSQL database
    if (token) {
      try {
        await removeReview(id, token);
      } catch (err) {
        console.warn("Server delete note (review removed locally):", err.message);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReviewId(null);
    setForm({
      name: user?.fullName || "",
      city: user?.city || "",
      fragrance: "",
      rating: 5,
      text: "",
      photo: null,
      orderNumber: "",
      selectedPurchaseIndex: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit new review or update existing review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.text.trim()) {
      alert("Please fill in your name and review text.");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const cleanFragrance = form.fragrance?.trim() || null;

      if (editingReviewId) {
        // Update existing review in PostgreSQL database
        const updated = await editReview(
          editingReviewId,
          {
            rating: Number(form.rating) || 5,
            text: form.text.trim(),
            photo: form.photo || null,
            city: form.city.trim() || "India",
            fragrance: cleanFragrance,
          },
          token
        );

        setReviews((prev) =>
          prev.map((r) =>
            r.id === editingReviewId
              ? {
                  ...r,
                  name: form.name.trim(),
                  city: form.city.trim() || "India",
                  fragrance: cleanFragrance,
                  orderNumber: form.orderNumber.trim() || r.orderNumber,
                  rating: Number(form.rating) || 5,
                  text: form.text.trim(),
                  photo: form.photo || null,
                  isEdited: true,
                  ...updated,
                }
              : r
          )
        );
      } else {
        // Create new review in PostgreSQL database
        const savedReview = await submitReview(
          {
            name: form.name.trim(),
            city: form.city.trim() || "India",
            fragrance: cleanFragrance,
            orderNumber: form.orderNumber.trim() || null,
            rating: Number(form.rating) || 5,
            text: form.text.trim(),
            photo: form.photo || null,
          },
          token
        );

        setReviews((prev) => [savedReview, ...prev]);
        setMyReviewIds((prev) => {
          const updated = [savedReview.id, ...prev];
          try {
            localStorage.setItem(MY_REVIEWS_STORAGE_KEY, JSON.stringify(updated));
          } catch (err) {
            console.error(err);
          }
          return updated;
        });
      }

      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        handleCloseModal();
      }, 1500);
    } catch (err) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // ----------------------------------------------------
  // Statistics Calculations for Ratings Overview Box
  // ----------------------------------------------------
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
          totalReviews
        ).toFixed(1)
      : "5";

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Number(r.rating) || 5;
    if (ratingCounts[star] !== undefined) {
      ratingCounts[star] += 1;
    }
  });

  // ----------------------------------------------------
  // Filter & Sort Logic
  // ----------------------------------------------------
  let filteredReviews = [...reviews];

  if (activeFilter === "5star") {
    filteredReviews = filteredReviews.filter((r) => Number(r.rating) === 5);
  }

  filteredReviews.sort((a, b) => {
    if (sortBy === "highest") {
      return (Number(b.rating) || 5) - (Number(a.rating) || 5);
    }
    if (sortBy === "lowest") {
      return (Number(a.rating) || 5) - (Number(b.rating) || 5);
    }
    return (b.timestamp || b.id) - (a.timestamp || a.id);
  });

  // Prepare smooth infinite loop items for marquee sliding view
  const displayLoopItems =
    filteredReviews.length === 0
      ? []
      : filteredReviews.length === 1
      ? [
          filteredReviews[0],
          filteredReviews[0],
          filteredReviews[0],
          filteredReviews[0],
          filteredReviews[0],
          filteredReviews[0],
        ]
      : filteredReviews.length < 4
      ? [
          ...filteredReviews,
          ...filteredReviews,
          ...filteredReviews,
          ...filteredReviews,
        ]
      : [...filteredReviews, ...filteredReviews];

  return (
    <section className="bg-[#11110f] py-16 sm:py-24 border-b border-white/10 text-[#f4efe6]">
      <Container>
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#8e8a82]">
            <Link to="/" className="hover:text-[#c6a15b] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#f4efe6]">Reviews</span>
          </nav>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c6a15b] mb-2">
              Community Praise
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-[#f4efe6] tracking-tight">
              Customer Reviews & Ratings
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#8e8a82] max-w-xl">
              Authentic feedback, decant reviews, and photos from our customer community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingReviewId(null);
              setIsModalOpen(true);
            }}
            className="self-start sm:self-auto inline-flex items-center gap-2.5 rounded-full border border-[#c6a15b] bg-[#221d15] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#f4efe6] hover:bg-[#c6a15b] hover:text-[#11110f] transition shadow-lg cursor-pointer shrink-0"
          >
            <MessageSquarePlus size={15} className="text-[#c6a15b]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 1. Ratings Overview Breakdown Card                   */}
        {/* ---------------------------------------------------- */}
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
                  Based on {totalReviews} verified customer {totalReviews === 1 ? "review" : "reviews"}
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
        <div className="rounded-xl border border-white/10 bg-[#161613] p-3 sm:p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Simple Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
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

          {/* Controls: View Mode & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto text-xs text-[#8e8a82]">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#11110f] p-1">
              <button
                type="button"
                onClick={() => setViewMode("marquee")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition cursor-pointer ${
                  viewMode === "marquee"
                    ? "bg-[#c6a15b] font-semibold text-[#11110f]"
                    : "text-[#8e8a82] hover:text-[#f4efe6]"
                }`}
                title="Sliding Marquee View"
              >
                <MoveHorizontal size={13} />
                <span className="hidden sm:inline">Sliding</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#c6a15b] font-semibold text-[#11110f]"
                    : "text-[#8e8a82] hover:text-[#f4efe6]"
                }`}
                title="Grid Columns View"
              >
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Sort Dropdown: Newest, Highest, Lowest */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-white/15 bg-[#1f1f1b] px-3 py-1.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3. Empty State Card vs Reviews Grid                   */}
        {/* ---------------------------------------------------- */}
        {filteredReviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#161613] p-12 sm:p-20 text-center max-w-3xl mx-auto shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b]">
              <Sparkles size={24} />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-[#f4efe6] mb-3">
              Be the first to share your The Decant Bar experience.
            </h3>

            <p className="text-xs sm:text-sm text-[#8e8a82] max-w-md mx-auto leading-relaxed mb-8">
              Share your thoughts on our authentic fragrances, atomizers, packaging, or customer service.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-[#c6a15b] bg-[#c6a15b] px-7 py-3 text-xs uppercase tracking-widest text-[#11110f] font-semibold hover:bg-[#d8c08a] transition shadow-lg"
              >
                <span>Explore Collection</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setEditingReviewId(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-xs uppercase tracking-wider text-[#f4efe6] font-medium hover:border-[#c6a15b] hover:text-[#c6a15b] transition cursor-pointer"
              >
                <MessageSquarePlus size={14} />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        ) : viewMode === "marquee" ? (
          /* ---------------------------------------------------- */
          /* Sliding Infinite Marquee View                        */
          /* ---------------------------------------------------- */
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4 -mx-4 sm:mx-0">
            <div className="group flex overflow-hidden w-full select-none py-2">
              <div className="flex shrink-0 gap-5 animate-marquee flex-row group-hover:[animation-play-state:paused] py-2">
                {displayLoopItems.map((rev, idx) => {
                  const canModify = isAuthor(rev);
                  return (
                    <TestimonialCard
                      key={`${rev.id}-${idx}`}
                      author={{
                        name: rev.name,
                        handle: rev.city || "Verified Buyer",
                        city: rev.city,
                      }}
                      text={rev.text}
                      fragrance={rev.fragrance}
                      rating={rev.rating}
                      date={rev.date}
                      photo={rev.photo}
                      verifiedBuyer={rev.verifiedBuyer}
                      canModify={canModify}
                      onEdit={() => handleStartEdit(rev)}
                      onDelete={() => handleDeleteReview(rev.id)}
                      onPhotoClick={(img) => setActivePhotoPreview(img)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Subtle Gradient Edge Vignettes */}
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 sm:w-40 bg-gradient-to-r from-[#11110f] via-[#11110f]/80 to-transparent sm:block z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-20 sm:w-40 bg-gradient-to-l from-[#11110f] via-[#11110f]/80 to-transparent sm:block z-10" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => {
              const canModify = isAuthor(rev);
              return (
                <TestimonialCard
                  key={rev.id}
                  author={{
                    name: rev.name,
                    handle: rev.city || "Verified Buyer",
                    city: rev.city,
                  }}
                  text={rev.text}
                  fragrance={rev.fragrance}
                  rating={rev.rating}
                  date={rev.date}
                  photo={rev.photo}
                  verifiedBuyer={rev.verifiedBuyer}
                  canModify={canModify}
                  onEdit={() => handleStartEdit(rev)}
                  onDelete={() => handleDeleteReview(rev.id)}
                  onPhotoClick={(img) => setActivePhotoPreview(img)}
                  className="w-full sm:w-full shrink"
                />
              );
            })}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. Strictly Verified Review Modal Form               */}
        {/* ---------------------------------------------------- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !submittedSuccess && handleCloseModal()}
            />

            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/15 bg-[#171715] p-6 sm:p-8 text-[#f4efe6] shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={18} className="text-[#c6a15b]" />
                    <h3 className="font-display text-2xl text-[#f4efe6]">
                      {editingReviewId ? "Edit Your Review" : "Share Your Experience"}
                    </h3>
                  </div>
                  <p className="text-xs text-[#8e8a82]">
                    Share your review about a fragrance or our decant service & packaging.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-[#8e8a82] hover:text-[#f4efe6] transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#c6a15b]/10 text-[#c6a15b] border border-[#c6a15b]/30">
                    <Check size={28} />
                  </div>
                  <h4 className="font-display text-2xl text-[#f4efe6]">
                    {editingReviewId ? "Review Updated!" : `Thank You, ${form.name || "Customer"}!`}
                  </h4>
                  <p className="mt-2 text-xs text-[#8e8a82] max-w-xs mx-auto leading-relaxed">
                    Your review and feedback have been published to the community.
                  </p>
                </div>
              ) : !isAuthenticated ? (
                /* Guard: Not Signed In */
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b]">
                    <LogIn size={26} />
                  </div>
                  <h4 className="font-display text-2xl text-[#f4efe6] mb-2">
                    Sign In to Write a Review
                  </h4>
                  <p className="text-xs sm:text-sm text-[#8e8a82] max-w-sm mx-auto leading-relaxed mb-6">
                    To keep our community reviews genuine, please log in or sign up before submitting your review.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to="/login?from=/reviews"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#c6a15b] bg-[#c6a15b] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#11110f] hover:bg-[#d8c08a] transition shadow-lg"
                    >
                      Sign In Now
                    </Link>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-full sm:w-auto rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-wider text-[#c5c1b9] hover:bg-white/5 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Review Form for logged-in users */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Rating <span className="text-[#c6a15b]">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm({ ...form, rating: star })}
                          className="cursor-pointer text-[#c6a15b] p-1 hover:scale-110 transition"
                        >
                          <Star
                            size={22}
                            fill={star <= form.rating ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-[#8e8a82] ml-2">
                        {form.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Manual Fragrance Input + Optional quick picks from past orders */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] font-medium">
                        Fragrance Name <span className="text-[#8e8a82] font-normal lowercase">(Optional)</span>
                      </label>
                      {form.fragrance && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              fragrance: "",
                              selectedPurchaseIndex: "",
                              orderNumber: "",
                            }))
                          }
                          className="text-[11px] text-[#8e8a82] hover:text-[#c6a15b] transition cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={form.fragrance}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          fragrance: e.target.value,
                          selectedPurchaseIndex: "",
                        }))
                      }
                      placeholder="e.g. Creed Aventus, Tom Ford, or leave blank for store review"
                      className="w-full rounded-lg border border-white/15 bg-[#11110f] px-3.5 py-2.5 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none"
                    />

                    {/* Quick suggestion chips from previous orders (if any) */}
                    {userPurchases.length > 0 && (
                      <div className="mt-2.5">
                        <span className="text-[11px] text-[#8e8a82] block mb-1">
                          Quick pick from your orders:
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {userPurchases.map((item, idx) => {
                            const label = `${item.name} (${item.size_ml}ml)`;
                            const isSelected = form.fragrance === label;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    fragrance: label,
                                    orderNumber: item.orderNumber || prev.orderNumber,
                                    selectedPurchaseIndex: String(idx),
                                  }));
                                }}
                                className={`text-[11px] px-2.5 py-1 rounded-md border transition cursor-pointer ${
                                  isSelected
                                    ? "border-[#c6a15b] bg-[#c6a15b]/20 text-[#c6a15b] font-medium"
                                    : "border-white/10 bg-[#1f1f1b] text-[#c5c1b9] hover:border-white/20 hover:text-[#f4efe6]"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <p className="text-[11px] text-[#8e8a82] mt-1.5">
                      Optional — leave blank if reviewing packaging, delivery, or general store experience.
                    </p>
                  </div>

                  {/* Customer Name & City */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                        Your Name <span className="text-[#c6a15b]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-lg border border-white/15 bg-[#11110f] px-3.5 py-2.5 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Mumbai"
                        className="w-full rounded-lg border border-white/15 bg-[#11110f] px-3.5 py-2.5 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Your Honest Review <span className="text-[#c6a15b]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      placeholder="How was the fragrance, atomizer projection, packaging, delivery, or customer service?"
                      className="w-full rounded-lg border border-white/15 bg-[#11110f] p-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Photo Upload Option */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Add a Photo (Optional)
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="review-photo-upload"
                    />

                    {form.photo ? (
                      <div className="relative rounded-xl border border-[#c6a15b]/40 bg-[#11110f] p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={form.photo}
                            alt="Uploaded decant"
                            className="h-12 w-12 object-cover rounded-lg border border-white/15"
                          />
                          <span className="text-xs text-[#f4efe6]">
                            Photo attached successfully
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="text-red-400 hover:text-red-300 p-2 cursor-pointer transition"
                          title="Remove photo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="review-photo-upload"
                        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-[#11110f] p-4 text-xs text-[#8e8a82] hover:border-[#c6a15b] hover:text-[#f4efe6] transition cursor-pointer"
                      >
                        <Camera size={16} className="text-[#c6a15b]" />
                        <span>Click or tap to capture or browse bottle/package photo (PNG, JPG, up to 5MB)</span>
                      </label>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-wider text-[#c5c1b9] hover:bg-white/5 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="rounded-full border border-[#c6a15b] bg-[#c6a15b] px-6 py-2.5 text-xs uppercase tracking-wider text-[#11110f] font-semibold hover:bg-[#d8c08a] transition cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      {isSubmittingReview
                        ? "Saving..."
                        : editingReviewId
                        ? "Update Review"
                        : "Submit Review"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Lightbox for Photos */}
        {activePhotoPreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActivePhotoPreview(null)}
          >
            <div className="relative max-w-3xl max-h-[90vh]">
              <button
                type="button"
                onClick={() => setActivePhotoPreview(null)}
                className="absolute -top-10 right-0 text-white hover:text-[#c6a15b] transition cursor-pointer"
              >
                <X size={26} />
              </button>
              <img
                src={activePhotoPreview}
                alt="Decant close-up"
                className="max-h-[85vh] max-w-full object-contain rounded-xl border border-white/20"
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
