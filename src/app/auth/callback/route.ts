import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Check for error parameters returned from OAuth provider
  const oauthError = searchParams.get("error");
  const oauthErrorDesc = searchParams.get("error_description");
  if (oauthError || oauthErrorDesc) {
    console.error("OAuth error returned from provider:", oauthError, oauthErrorDesc);
    const errorUrl = new URL("/auth/login", origin);
    errorUrl.searchParams.set("error", oauthErrorDesc || oauthError || "auth_callback_failed");
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    // Determine proper base origin (support Vercel and reverse proxies)
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    const isLocalEnv = process.env.NODE_ENV === "development";
    const redirectBase = isLocalEnv
      ? origin
      : forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : origin;

    const targetUrl = next.startsWith("http") ? next : `${redirectBase}${next}`;
    const response = NextResponse.redirect(targetUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return response;
    }

    console.error("Exchange code error in /auth/callback:", exchangeError);
    const errorUrl = new URL("/auth/login", origin);
    errorUrl.searchParams.set("error", exchangeError.message);
    return NextResponse.redirect(errorUrl);
  }

  // If no code in query params, it might have been passed as an implicit hash fragment (#access_token=...)
  // which can only be read on the client. Redirect to /auth/confirm to inspect the hash fragment.
  return NextResponse.redirect(new URL("/auth/confirm", origin));
}
