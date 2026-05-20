import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { password, role } = credentials

        if (role === 'admin' && password === process.env.ADMIN_PASSWORD) {
          return { id: 'admin', name: 'Admin', email: 'admin@mtai.internal', role: 'admin' }
        }

        if (password === process.env.FACILITATOR_PASSWORD) {
          return { id: 'facilitator', name: 'Facilitator', email: 'facilitator@mtai.internal', role: 'facilitator' }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role
      return token
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string
      return session
    },
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
}
