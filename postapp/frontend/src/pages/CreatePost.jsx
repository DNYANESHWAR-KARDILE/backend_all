import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCheck,
  Eye,
  Hash,
  Send,
  RefreshCw,
} from "lucide-react";
import { showToast } from "../utils/toast";

const MAX_CAPTION = 500;

const SUGGESTED_TAGS = [
  "#photography",
  "#nature",
  "#community",
  "#creative",
  "#moments",
  "#design",
  "#lifestyle",
  "#coding",
];

const SAMPLE_PRESETS = [
  {
    name: "Golden Hour",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
    filename: "golden-hour.jpg",
  },
  {
    name: "Minimalist Architecture",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80",
    filename: "minimal-architecture.jpg",
  },
  {
    name: "Urban Night",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1000&auto=format&fit=crop&q=80",
    filename: "urban-night.jpg",
  },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fitMode, setFitMode] = useState("cover"); // "cover" | "contain"

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const selectFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    setError("");
    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      selectFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddTag = (tag) => {
    if (caption.includes(tag)) return;
    const newCaption = caption ? `${caption} ${tag}` : tag;
    if (newCaption.length <= MAX_CAPTION) {
      setCaption(newCaption);
    }
  };

  const loadSample = async (preset) => {
    try {
      setSampleLoading(true);
      setError("");
      const response = await fetch(preset.url);
      const blob = await response.blob();
      const file = new File([blob], preset.filename, { type: blob.type });
      selectFile(file);
      showToast(`Loaded sample: "${preset.name}"`);
    } catch (err) {
      console.error(err);
      setError("Could not load sample image. Please pick an image from your files.");
    } finally {
      setSampleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!image) {
      setError("Please select an image file to publish.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("post", image);
      formData.append("caption", caption);

      const response = await fetch("http://localhost:8000/create-post", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish post.");
      }

      setMessage("Your post has been published successfully to the community feed!");
      showToast("Post published successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to upload post. Please make sure backend is running on http://localhost:8000"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ambient-grid px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="group mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to feed</span>
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Create new post
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                Upload your media, write an expressive caption, and share with
                the Postify community.
              </p>
            </div>

            {/* Steps indicator */}
            <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white border border-slate-200/80 px-4 py-2 shadow-xs text-xs font-semibold text-slate-600">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white ${image ? "bg-emerald-500" : "bg-indigo-600"}`}>
                1
              </span>
              <span>Media</span>
              <span className="text-slate-300">→</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white ${caption.length > 0 ? "bg-emerald-500" : "bg-slate-400"}`}>
                2
              </span>
              <span>Caption</span>
              <span className="text-slate-300">→</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[10px] text-white">
                3
              </span>
              <span>Publish</span>
            </div>
          </div>
        </div>

        {/* Notification alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-800 backdrop-blur-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Upload Notice</p>
              <p className="mt-0.5 text-rose-700">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-rose-500 hover:text-rose-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-800 backdrop-blur-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Success!</p>
              <p className="mt-0.5 text-emerald-700">{message}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Image Upload & Preview */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
              {/* Card Header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Media Upload
                  </h2>
                  <p className="text-xs text-slate-500">
                    JPG, PNG, WEBP or GIF • Up to 10MB
                  </p>
                </div>

                {image && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFitMode(fitMode === "cover" ? "contain" : "cover")
                      }
                      className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                      title="Toggle fit mode"
                    >
                      {fitMode === "cover" ? "Fit view" : "Fill view"}
                    </button>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
                className={`relative flex min-h-[380px] sm:min-h-[440px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                  preview
                    ? "border-slate-200 bg-slate-950"
                    : dragging
                    ? "border-indigo-500 bg-indigo-50/70 scale-[0.99]"
                    : "border-slate-200/90 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/50 cursor-pointer"
                }`}
              >
                {preview ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Selected upload"
                      className={`max-h-[460px] w-full transition duration-300 ${
                        fitMode === "cover" ? "object-cover" : "object-contain"
                      }`}
                    />

                    {/* Overlay chip */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-slate-950/75 px-3.5 py-2 text-xs text-white backdrop-blur-md border border-white/10">
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="truncate font-medium">{image?.name}</span>
                      </div>
                      <span className="shrink-0 text-slate-300 font-mono text-[11px]">
                        {formatFileSize(image?.size)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center px-6 py-10 text-center">
                    <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 shadow-inner">
                      <UploadCloud className="h-10 w-10 animate-bounce duration-1000" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      Choose an image or drag &amp; drop
                    </h3>

                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
                      High resolution photographs, artwork, or banners look best.
                      Drag your file here or click below to browse.
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 transition"
                    >
                      <ImageIcon className="h-4 w-4 text-indigo-400" />
                      <span>Browse Files</span>
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Sample Preset Buttons for Fast Testing */}
              {!image && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Quick Sample Presets
                    </span>
                    {sampleLoading && (
                      <span className="text-xs text-indigo-600 font-medium animate-pulse">
                        Loading sample...
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {SAMPLE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => loadSample(preset)}
                        disabled={sampleLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles className="h-3 w-3 text-indigo-500" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Caption, Tags & Live Preview */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Post Caption &amp; Story
                </h2>
                <p className="text-xs text-slate-500">
                  Write a captivating caption or add descriptive keywords.
                </p>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  id="caption"
                  rows={5}
                  value={caption}
                  maxLength={MAX_CAPTION}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What is this photo about? Share the moment, details, or feelings..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 transition"
                />

                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Markdown &amp; hashtags supported</span>
                  <span
                    className={`font-mono ${
                      caption.length >= MAX_CAPTION
                        ? "text-rose-500 font-bold"
                        : ""
                    }`}
                  >
                    {caption.length} / {MAX_CAPTION}
                  </span>
                </div>
              </div>

              {/* Suggested Hashtags */}
              <div className="mt-5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
                  <Hash className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Suggested Community Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        caption.includes(tag)
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/"
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading || !image}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/35 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Publish Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Feed Mockup Preview Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Feed Preview
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 overflow-hidden">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center text-[10px] font-bold">
                    YOU
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      @your_handle
                    </p>
                    <p className="text-[10px] text-slate-400">Just now</p>
                  </div>
                </div>

                <div className="aspect-[4/5] max-h-56 rounded-xl bg-slate-200 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Feed Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 text-xs">
                      <ImageIcon className="h-8 w-8 mb-1 stroke-1" />
                      <span>Image will appear here</span>
                    </div>
                  )}
                </div>

                <p className="mt-2.5 text-xs text-slate-700 line-clamp-2 leading-relaxed">
                  {caption || "Your post caption will appear here..."}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}