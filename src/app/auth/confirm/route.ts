import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// This route handles Magic Link / OTP email confirmation tokens
// Supabase sends the user here: /auth/confirm?token_hash=...&type=email
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const response = NextResponse.redirect(`${origin}${next}`);

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

    const { error } = await supabase.auth.verifyOtp({
      type: type as Parameters<typeof supabase.auth.verifyOtp>[0]["type"],
      token_hash,
    });

    if (!error) {
      return response;
    }
  }

  const errorUrl = new URL("/auth/login", origin);
  errorUrl.searchParams.set("error", "link_expired");
  return NextResponse.redirect(errorUrl);
}
