import { useCallback, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  RotateCw,
  Plus,
  Search,
  Sparkles,
  LayoutGrid,
  List,
  AlertTriangle,
  FolderOpen,
  X,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import PostCard from "../components/PostCard";
import ImageModal from "../components/ImageModal";

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100">
        <div className="h-9 w-9 rounded-xl animate-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded-md animate-shimmer" />
          <div className="h-2.5 w-16 rounded-md animate-shimmer" />
        </div>
      </div>

      {/* Image skeleton */}
      <div className="aspect-[4/5] w-full animate-shimmer" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-7 w-20 rounded-xl animate-shimmer" />
          <div className="h-7 w-12 rounded-xl animate-shimmer" />
        </div>
        <div className="h-3 w-5/6 rounded-md animate-shimmer" />
        <div className="h-3 w-2/3 rounded-md animate-shimmer" />
      </div>
    </div>
  );
}

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"
  const [layoutMode, setLayoutMode] = useState("grid"); // "grid" | "compact"
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const response = await fetch("http://localhost:8000/posts");

      if (!response.ok) {
        throw new Error(`Failed to fetch posts (Status: ${response.status})`);
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError(
        "Could not load posts from the server. Please verify your backend server is running on http://localhost:8000"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function initFetch() {
      try {
        const response = await fetch("http://localhost:8000/posts");
        if (!response.ok) {
          throw new Error(`Failed to fetch posts (Status: ${response.status})`);
        }
        const data = await response.json();
        if (!ignore) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError(
            "Could not load posts from the server. Please verify your backend server is running on http://localhost:8000"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initFetch();

    return () => {
      ignore = true;
    };
  }, []);

  // Filter & sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter by caption
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.caption && p.caption.toLowerCase().includes(term)
      );
    }

    // Sort order
    if (sortOrder === "oldest") {
      result.reverse();
    }

    return result;
  }, [posts, searchTerm, sortOrder]);

  return (
    <div className="min-h-screen bg-ambient-grid px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-700 backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>COMMUNITY VISUAL FEED</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-5xl leading-[1.15]">
                Discover stories &amp;{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  moments worth sharing.
                </span>
              </h1>

              <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-slate-600">
                Explore real-time visual updates, creative photography, and
                insights shared by members worldwide.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => fetchPosts(true)}
                disabled={refreshing || loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-50"
              >
                <RotateCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin text-indigo-600" : ""}`}
                />
                <span>{refreshing ? "Refreshing..." : "Refresh Feed"}</span>
              </button>

              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
              >
                <Plus className="h-4 w-4 text-indigo-400" />
                <span>Create Post</span>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          {!loading && !error && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Posts
                  </span>
                  <ImageIcon className="h-4 w-4 text-indigo-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {posts.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Active Creators
                  </span>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {posts.length > 0 ? posts.length : 1}+
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    ImageKit CDN
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-emerald-600">
                  Optimal
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Network
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">REST API</span>
                </div>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  Online
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Filter & Toolbar */}
        {!loading && !error && posts.length > 0 && (
          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts by keywords, hashtags, caption..."
                className="w-full rounded-xl border border-transparent bg-slate-100/80 pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort & View Mode Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1">
                <button
                  onClick={() => setSortOrder("newest")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    sortOrder === "newest"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortOrder("oldest")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    sortOrder === "oldest"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Oldest
                </button>
              </div>

              {/* Layout Switcher */}
              <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1">
                <button
                  onClick={() => setLayoutMode("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded-lg text-xs transition ${
                    layoutMode === "grid"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayoutMode("compact")}
                  title="Compact Feed View"
                  className={`p-1.5 rounded-lg text-xs transition ${
                    layoutMode === "compact"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 sm:p-12 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-950 sm:text-2xl">
              Unable to reach backend server
            </h3>

            <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-slate-600">
              {error}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fetchPosts(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition"
              >
                <RotateCw className="h-4 w-4" />
                <span>Retry Connection</span>
              </button>

              <Link
                to="/create-post"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Go to Create Post
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center backdrop-blur-xs">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
              <FolderOpen className="h-10 w-10" />
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-950">
              No posts shared yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Be the first community member to publish a moment, photo, or story.
              Your post will show up here instantly!
            </p>

            <Link
              to="/create-post"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Post</span>
            </Link>
          </div>
        )}

        {/* Search Empty Results */}
        {!loading &&
          !error &&
          posts.length > 0 &&
          filteredAndSortedPosts.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <Search className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No matching posts found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                We couldn&apos;t find any posts matching &ldquo;{searchTerm}&rdquo;. Try another
                keyword or clear your filter.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Clear Search
              </button>
            </div>
          )}

        {/* Posts Display */}
        {!loading && !error && filteredAndSortedPosts.length > 0 && (
          <div
            className={
              layoutMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "mx-auto max-w-2xl space-y-6"
            }
          >
            {filteredAndSortedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onOpenModal={(p) => setSelectedPost(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <ImageModal
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}