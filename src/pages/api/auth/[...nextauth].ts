import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import nodemailer from 'nodemailer'

import { prisma } from '@/libs/prisma'

const EMAIL_SERVER = process.env.EMAIL_SERVER
const EMAIL_FROM = process.env.EMAIL_FROM
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET
const EMAIL = process.env.EMAIL

if (!EMAIL_SERVER || !EMAIL_FROM || !NEXTAUTH_SECRET || !EMAIL) {
  throw new Error(
    'EMAIL_SERVER, EMAIL_FROM, EMAIL or NEXTAUTH_SECRET not found.'
  )
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: EMAIL_SERVER,
      from: EMAIL_FROM,
      sendVerificationRequest({ identifier: email, url, provider }) {
        if (email !== EMAIL) {
          throw new Error('Your Email is valid.')
        }
        const transporter = nodemailer.createTransport(provider.server)
        const { host } = new URL(url)

        const emailBody = `
          <p>こんにちは</p>
          <p>下記のURLからログインしてください:</p>
          <a href="${url}" target="_blank" style="display: inline-block;
          font-size: 9pt;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          padding: 12px 12px;
          background: #000066;
          color: #ffffff;">Sign in to ${host}</a>
          <p>心当たりがない場合は削除してください</p>
        `

        return transporter
          .sendMail({
            to: email,
            from: provider.from,
            subject: `ログイン認証: ${host}`,
            html: emailBody,
          })
          .then(() => {
            console.log(`Sign-in email sent to ${email}`)
          })
          .catch((error) => {
            console.error('Error sending sign-in email', error)
          })
      },
    }),
  ],
  secret: NEXTAUTH_SECRET,
})
