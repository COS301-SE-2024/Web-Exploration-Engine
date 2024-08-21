import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY!
);

const protectedRoutes = ["/savedreports"];

export default async function middleware(req: NextRequest) {
    console.log('Middleware is running!');
    const { data: { session } } = await supabase.auth.getSession();
  
    if (!session && protectedRoutes.includes(req.nextUrl.pathname)) {
      const absoluteURL = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  
    return NextResponse.next();
  }