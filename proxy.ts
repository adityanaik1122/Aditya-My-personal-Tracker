import { NextResponse, type NextRequest } from "next/server"

const sessionCookieName = "learning_hub_session"

const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout"]

async function isValidSession(token: string | undefined) {
  const secret = process.env.LEARNING_HUB_SESSION_SECRET
  if (!secret || !token) return false

  const [payload, signature] = token.split(".")
  if (payload !== "learning-hub-authenticated" || !signature) return false

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"])
  const signatureBytes = new Uint8Array(signature.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [])
  return crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(payload))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (publicPaths.includes(pathname) || pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  if (await isValidSession(request.cookies.get(sessionCookieName)?.value)) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("next", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!api/progress).*)", "/api/progress"],
}
