import { NextRequest, NextResponse } from "next/server";

// Middleware pour vérifier l'authentification
export default async function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname !== "/auth") {
    return handleRedirect(request);
  }

  try {
    if (token && request.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return handleRedirect(request);
  }
}

// Fonction pour gérer la redirection vers la page de login
function handleRedirect(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/auth"],
};
