import { NextRequest, NextResponse } from 'next/server';

import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

export function middleware(params: NextRequest) {
  const authRequired =
    !!process.env.HTTP_AUTH_USERNAME &&
    !!process.env.HTTP_AUTH_PASSWORD &&
    !!process.env.NEXTAUTH_SECRET &&
    !!process.env.NEXTAUTH_URL;

  if (authRequired) {
    return nextAuthMiddleware(params as NextRequestWithAuth);
  }

  return NextResponse.next();
}
