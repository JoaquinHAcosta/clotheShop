import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from './mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'zoma' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB()
        const userFound = await User.findOne({
          email: credentials?.email,
        }).select('+password')

        if (!userFound) throw new Error('Invalid Email')

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        )

        if (!passwordMatch) throw new Error('Invalid password')

        return userFound
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }

      if (trigger === 'update' && session?.email) {
        token.email = session.email
      }

      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          phone: u.phone,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          _id: token.id,
          name: token.name,
          phone: token.phone,
        },
      }
    },
  },
}
