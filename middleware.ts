import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── If NOT logged in ──────────────────────────────────────────
  // Allow access to /login only, redirect everything else to /login
  if (!user) {
    if (path === "/login" || path === "/auth/login") return response;
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── If logged in ──────────────────────────────────────────────
  // Get their role - use array response instead of .single() to avoid errors
  const { data: profiles } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id);

  let role = profiles?.[0]?.role || user.user_metadata?.role || null;

  // ── Role-to-dashboard mapping ──────────────────────────────────
  const roleDashboardMap: Record<string, string> = {
    budget_officer: "/budget_officer/dashboard",
    ssme_reviewer: "/ssme_reviewer/dashboard",
    smme_reviewer: "/ssme_reviewer/dashboard", // Handle role name variant
    functional_chief: "/functional_chief/dashboard",
    accountant: "/accountant/dashboard",
    asds: "/asds/dashboard",
    sds: "/sds/dashboard",
    program_owner: "/program_owner/dashboard",
    pmt_validator: "/pmt_validator/dashboard",
    pmis_coordinator: "/pmis_coordinator/dashboard",
    hrd_reviewer: "/hrd_reviewer/dashboard",
    system_admin: "/system_admin/dashboard",
    admin: "/budget_officer/dashboard",
  };

  // Already on /login → redirect to their dashboard
  if (path === "/login") {
    const dashboard = roleDashboardMap[role] || "/budget_officer/dashboard";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Redirect root to their dashboard
  if (path === "/") {
    const dashboard = roleDashboardMap[role] || "/budget_officer/dashboard";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (svg, png, jpg, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};