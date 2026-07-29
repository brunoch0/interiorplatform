"use client";

import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { grantAdminCookie } from "@/app/admin-grant";
import { useI18n } from "@/lib/i18n/provider";

export default function AuthButton() {
  const { dict } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
      // Super admins (ADMIN_EMAILS) get the ops_key cookie on sign-in — /admin just works
      if (data.session?.access_token) void grantAdminCookie(data.session.access_token);
    });
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.access_token) void grantAdminCookie(session.access_token);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = () =>
    supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
    setMenuOpen(false);
  };

  if (!ready)
    return <span className="h-9 w-20 rounded-xl bg-gray-100" aria-hidden />;

  if (!user)
    return (
      <button
        onClick={signIn}
        className="inline-flex items-center gap-2 rounded-xl bg-walnut px-4 py-2 text-sm font-semibold text-cream transition hover:bg-walnut-deep"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path fill="#FFFDF9" d="M21.35 11.1H12v2.9h5.35c-.25 1.4-1.02 2.58-2.17 3.38v2.8h3.5c2.05-1.9 3.22-4.68 3.22-7.98 0-.66-.06-1.2-.15-1.7z" opacity=".9"/>
          <path fill="#FFFDF9" d="M12 22c2.7 0 4.96-.9 6.68-2.42l-3.5-2.8c-.9.62-2.07 1-3.18 1-2.6 0-4.8-1.76-5.58-4.12H2.8v2.88C4.5 19.98 8 22 12 22z" opacity=".7"/>
          <path fill="#FFFDF9" d="M6.42 13.66A5.9 5.9 0 0 1 6.1 12c0-.58.12-1.14.3-1.66V7.46H2.8A9.98 9.98 0 0 0 2 12c0 1.6.38 3.12 1.06 4.46l3.36-2.8z" opacity=".5"/>
          <path fill="#FFFDF9" d="M12 6.2c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.95 3.1 14.7 2 12 2 8 2 4.5 4.02 2.8 7.46l3.6 2.88C7.2 7.96 9.4 6.2 12 6.2z" opacity=".8"/>
        </svg>
        {dict.nav.signIn}
      </button>
    );

  const initial = (user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase();
  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-terracotta-tint text-sm font-bold text-terracotta-deep"
        aria-label="Account menu"
      >
        {user.user_metadata?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full object-cover" />
        ) : initial}
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-gray-200 bg-cream p-2 shadow-md">
          <p className="truncate px-3 py-2 text-xs text-gray-400">{user.email}</p>
          <a href="/account" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-charcoal hover:bg-gray-100">
            <UserRound className="h-4 w-4" /> {dict.nav.myPage}
          </a>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" /> {dict.nav.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
