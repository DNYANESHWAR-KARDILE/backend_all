import { useEffect, useState } from "react";
import { X, Copy, ExternalLink, Heart, Sparkles, Check } from "lucide-react";
import { showToast } from "../utils/toast";

export default function ImageModal({ post, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(post.post);
    setCopied(true);
    showToast("Direct image link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const authorSeed = post._id ? post._id.slice(-4) : "art";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col lg:flex-row bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Mobile/Desktop */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-transform hover:scale-105"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media Preview Area */}
        <div className="relative flex-1 flex items-center justify-center bg-black/60 min-h-[300px] lg:min-h-[550px] p-2 sm:p-4">
          <img
            src={post.post}
            alt={post.caption || "Community image"}
            className="max-h-[60vh] lg:max-h-[85vh] w-auto max-w-full object-contain rounded-xl select-none"
          />
        </div>

        {/* Details Sidebar in Modal */}
        <div className="w-full lg:w-96 flex flex-col justify-between bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 sm:p-6 text-white">
          <div>
            {/* Author details */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 text-sm">
                {authorSeed.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-sm text-slate-100 truncate">
                    creator_{authorSeed}
                  </h4>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 truncate">Community Creator</p>
              </div>
            </div>

            {/* Caption */}
            <div className="mt-5">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Caption
              </h5>
              <div className="max-h-48 overflow-y-auto pr-1">
                <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {post.caption || "No caption was provided for this post."}
                </p>
              </div>
            </div>

            {/* Technical details badge */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Post ID: #{authorSeed}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
                Verified CDN
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <div className="flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition ${
                  liked
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    liked ? "fill-rose-500 text-rose-500" : "text-slate-400"
                  }`}
                />
                <span>{liked ? "Liked" : "Like"}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <a
              href={post.post}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Original Image</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
