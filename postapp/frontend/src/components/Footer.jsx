import { Link } from "react-router-dom";
import { Layers, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/90 bg-white/70 backdrop-blur-md">
      {/* Top Highlights Strip */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Instant CDN Delivery
                </h4>
                <p className="text-xs text-slate-500">
                  Blazing fast media loading powered by ImageKit.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Secure & Reliable
                </h4>
                <p className="text-xs text-slate-500">
                  Reliable uploads with validation and error handling.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Open Community
                </h4>
                <p className="text-xs text-slate-500">
                  Share moments, stories, and ideas with everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand Info */}
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950">
                Postify
              </span>
            </Link>

            <p className="mt-3.5 text-sm leading-relaxed text-slate-600">
              A modern, production-grade visual sharing platform. Express your creativity,
              upload moments, and discover inspiring stories shared by the global community.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Backend API active at http://localhost:8000</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Navigation
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-slate-600 hover:text-indigo-600 transition"
                  >
                    Explore Feed
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-post"
                    className="text-slate-600 hover:text-indigo-600 transition"
                  >
                    Create Post
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Technology
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  React 19 & Vite
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Tailwind CSS v4
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Express & ImageKit
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Postify. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with modern design principles & attention to detail
          </p>
        </div>
      </div>
    </footer>
  );
}