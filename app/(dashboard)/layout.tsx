"use client";

/**
 * Dashboard layout — wraps all protected pages.
 * Contains the full Navbar with user avatar and logout.
 * The Search bar lives on the home page, not in the Navbar,
 * to avoid layout shifts on the detail page.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/features/auth/authSlice";

function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  function handleLogout() {
    dispatch(logout());
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-shadow">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
              ProductHub
            </span>
          </Link>

          {/* Right section: user info + logout */}
          <div className="flex items-center gap-3">
            {/* 
            cart icon to go to cart page
          */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {user && (
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                  )}
                  <span className="text-sm text-slate-300 font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                {/* Mobile avatar only */}
                <div className="sm:hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName}
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                      {user.firstName?.[0]}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              id="logout-button"
              onClick={handleLogout}
              aria-label="Logout"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-slate-600">
            © 2026 ProductHub. Powered by{" "}
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              DummyJSON
            </a>
          </p>
          <p className="text-xs text-slate-600">
            Built with Next.js 16 · Redux Toolkit · RTK Query
          </p>
        </div>
      </footer>
    </div>
  );
}
