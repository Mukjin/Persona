import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const pathname = request.nextUrl.pathname;
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/personas");
  const isPublicChat = pathname.startsWith("/chat/");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/auth/callback");

  // Skip auth lookup entirely for public routes so the app still renders
  // even when Supabase/Auth is temporarily unreachable.
  if (!isProtected) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: "", ...options });
      }
    }
  });

  let user = null;
  try {
    const {
      data: { user: nextUser }
    } = await supabase.auth.getUser();
    user = nextUser;
  } catch {
    // If Supabase is temporarily unavailable, keep public routes accessible
    // instead of failing the entire app at middleware time.
    user = null;
  }

  if (isProtected && !user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
