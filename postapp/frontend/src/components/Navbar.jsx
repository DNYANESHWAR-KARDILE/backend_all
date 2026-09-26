import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Compass,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
        : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
    }`;

  const getMobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold transition-all ${
      isActive
        ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
        : "text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group flex items-center gap-3 transition"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/35">
            <Layers className="h-6 w-6 transform group-hover:rotate-6 transition-transform" />
            <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-950">
                Postify
              </span>
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block -mt-0.5">
              Visual Community Feed
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
          <NavLink to="/" className={getNavLinkClass}>
            <Compass className="h-4 w-4" />
            <span>Explore Feed</span>
          </NavLink>

          <NavLink to="/create-post" className={getNavLinkClass}>
            <PlusCircle className="h-4 w-4" />
            <span>Create Post</span>
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/create-post"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>New Post</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/create-post"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
            aria-label="Create Post"
          >
            <PlusCircle className="h-5 w-5" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-900" />
            ) : (
              <Menu className="h-5 w-5 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-6 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={getMobileNavLinkClass}
            >
              <div className="flex items-center gap-3">
                <Compass className="h-5 w-5" />
                <span>Explore Feed</span>
              </div>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </NavLink>

            <NavLink
              to="/create-post"
              onClick={() => setMobileMenuOpen(false)}
              className={getMobileNavLinkClass}
            >
              <div className="flex items-center gap-3">
                <PlusCircle className="h-5 w-5" />
                <span>Create New Post</span>
              </div>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </NavLink>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Backend: Connected
              </span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}