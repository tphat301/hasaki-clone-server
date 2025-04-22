import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { CONFIG_ENV } from '~/constants/config'

type SendMail = {
  email: string
  subject: string
  html: string
}
type MailOptions = Pick<SendMail, 'subject' | 'html'> & {
  from: string
  to: string
}

const htmlverifySendMail = fs.readFileSync(path.resolve('src/templates/mail.html'), 'utf8')

export const sendMail = ({ email, subject, html }: SendMail) => {
  const transporter = nodemailer.createTransport({
    host: CONFIG_ENV.MAIL_HOST,
    port: Number(CONFIG_ENV.MAIL_PORT),
    secure: false, // true for port 465, false for other ports
    auth: {
      user: CONFIG_ENV.MAIL_FROM_ADDRESS,
      pass: CONFIG_ENV.MAIL_PASSWORD
    }
  })

  const mailOptions: MailOptions = {
    from: CONFIG_ENV.MAIL_FROM_ADDRESS,
    to: email,
    subject,
    html
  }

  return transporter.sendMail(mailOptions)
}

export const verifySendMail = ({ email, subject, token }: Pick<SendMail, 'email' | 'subject'> & { token: string }) => {
  const html = htmlverifySendMail
    .replace('{{title}}', 'Vui lòng kiểm tra mã xác thực tài khoản')
    .replace('{{content}}', 'Click vào nút chuyển hướng đến trang xác thực tài khoản')
    .replace('{{button}}', 'Xác thực tài khoản')
    .replace('{{code}}', `${token}`)
    .replace('{{link}}', `${CONFIG_ENV.CLIENT_URL}/verify-account?token=${token}`)
    .replace('{{titleLink}}', 'Xác thực')
  return sendMail({ email, subject, html })
}

export const forgotPasswordSendMail = ({
  email,
  subject,
  token
}: Pick<SendMail, 'email' | 'subject'> & { token: string }) => {
  const html = htmlverifySendMail
    .replace('{{title}}', 'Vui lòng kiểm tra mã xác thực tài khoản')
    .replace('{{content}}', 'Click vào nút chuyển hướng đến trang thay đổi mật khẩu')
    .replace('{{button}}', 'Xác minh lấy lại mật khẩu')
    .replace('{{code}}', `${token}`)
    .replace('{{link}}', `${CONFIG_ENV.CLIENT_URL}/reset-password?token=${token}`)
    .replace('{{titleLink}}', 'Đổi mật khẩu')
  return sendMail({ email, subject, html })
}
