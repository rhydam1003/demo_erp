import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
  
  // Clear the auth cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });

  // Add no-cache headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}