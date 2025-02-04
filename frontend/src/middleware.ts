import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface Payload {
  email: string;
  role: string;
}

// Décoder la clé secrète en Base64
const SECRET_KEY = Uint8Array.from(atob(process.env.SECRET_KEY || ""), (c) =>
  c.charCodeAt(0)
);

// Middleware pour vérifier l'authentification
export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Récupérer le token depuis les cookies

  if (!token) {
    return handleRedirect(request);
  }

  try {
    if (request.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/taches", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return handleRedirect(request);
  }
}

// Fonction pour gérer la redirection vers la page de login
function handleRedirect(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/taches")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

// Configuration des routes protégées
export const config = {
  matcher: ["/taches/:path*", "/taches", "/auth/:path*"],
};
