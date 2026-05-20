export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/session/:path*', '/admin/:path*'],
}
