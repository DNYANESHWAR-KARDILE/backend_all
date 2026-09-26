import { useState } from "react";
import {
  Heart,
  Share2,
  Maximize2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { showToast } from "../utils/toast";

export default function PostCard({ post, onOpenModal }) {
  const [liked, setLiked] = useState(() => {
    try {
      return localStorage.getItem(`post_like_${post._id}`) === "true";
    } catch {
      return false;
    }
  });

  const [likeCount, setLikeCount] = useState(() => {
    // Deterministic base like count based on post id
    const seed = post._id ? parseInt(post._id.slice(-2), 16) % 35 + 8 : 12;
    try {
      const isLiked = localStorage.getItem(`post_like_${post._id}`) === "true";
      return isLiked ? seed + 1 : seed;
    } catch {
      return seed;
    }
  });

  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    try {
      localStorage.setItem(`post_like_${post._id}`, newLiked ? "true" : "false");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(post.post);
    setCopied(true);
    showToast("Direct image URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Post on Postify",
          text: post.caption || "Check out this post on Postify!",
          url: post.post,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyLink(e);
        }
      }
    } else {
      handleCopyLink(e);
    }
  };

  const authorSeed = post._id ? post._id.slice(-4) : "art";

  // Format caption to highlight hashtags
  const renderCaption = (text) => {
    if (!text) return <span className="text-slate-400 italic">No caption provided</span>;

    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith("#") && word.length > 1) {
        return (
          <span key={i} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const isLongCaption = (post.caption || "").length > 120;

  return (
    <article className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-900/8 transition-all duration-300 hover:-translate-y-1">
      {/* Header: Author info */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-indigo-500/20 shrink-0">
            {authorSeed.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-800 tracking-tight truncate">
                creator_{authorSeed}
              </span>
              <Sparkles className="h-3 w-3 text-indigo-500 shrink-0" />
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5">Postify Creator</span>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          title="Copy Image URL"
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Media container */}
      <div
        className="relative aspect-[4/5] bg-slate-900 overflow-hidden cursor-pointer select-none"
        onClick={() => onOpenModal(post)}
      >
        {/* Shimmer skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-shimmer" />
        )}

        <img
          src={post.post}
          alt={post.caption || "Community Post"}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Ambient bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-white tracking-wide uppercase">
            Community
          </span>
        </div>

        {/* Hover overlay quick action */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(post);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-lg backdrop-blur-md transform transition hover:scale-105"
          >
            <Maximize2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Expand</span>
          </button>

          <a
            href={post.post}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center h-8 w-8 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-lg backdrop-blur-md transform transition hover:scale-105"
            title="Open original"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-700" />
          </a>
        </div>
      </div>

      {/* Card interactive bar */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Action Row */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLike}
                className="flex items-center gap-1.5 text-xs font-semibold group/btn transition"
                aria-label="Like post"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                    liked
                      ? "bg-rose-50 text-rose-500 scale-110"
                      : "bg-slate-100 text-slate-600 group-hover/btn:bg-rose-50 group-hover/btn:text-rose-500"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-transform ${
                      liked ? "fill-rose-500" : ""
                    }`}
                  />
                </div>
                <span className={liked ? "text-rose-600" : "text-slate-600"}>
                  {likeCount}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
                aria-label="Share post"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-indigo-50 transition">
                  <Share2 className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <button
              onClick={() => onOpenModal(post)}
              className="text-slate-400 hover:text-indigo-600 transition p-1"
              title="View full post"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Caption text */}
          <div className="mt-1">
            <p
              className={`text-sm leading-relaxed text-slate-700 ${
                !expanded && isLongCaption ? "line-clamp-2" : ""
              }`}
            >
              {renderCaption(post.caption)}
            </p>

            {isLongCaption && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Verified Post
          </span>
          <span className="font-mono text-slate-400">#{authorSeed}</span>
        </div>
      </div>
    </article>
  );
}
