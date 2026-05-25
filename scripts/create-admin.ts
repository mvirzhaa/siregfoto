/**
 * Script untuk membuat akun admin.
 * Jalankan: npm run admin:create
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as readline from 'readline/promises'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  console.log('\n🔐 Studio BPPSI UIKA — Buat Akun Admin\n')

  const username = (await rl.question('Username    : ')).trim()
  const email    = (await rl.question('Email admin : ')).trim()
  const password = await rl.question('Password    : ')
  rl.close()

  if (!username) { console.error('❌ Username tidak boleh kosong'); process.exit(1) }
  if (!email || !email.includes('@')) { console.error('❌ Email tidak valid'); process.exit(1) }
  if (password.length < 8) { console.error('❌ Password minimal 8 karakter'); process.exit(1) }

  const existingUsername = await prisma.adminUser.findUnique({ where: { username } })
  if (existingUsername) { console.error(`❌ Username '${username}' sudah ada`); process.exit(1) }

  const existingEmail = await prisma.adminUser.findUnique({ where: { email } })
  if (existingEmail) { console.error(`❌ Email '${email}' sudah digunakan`); process.exit(1) }

  const passwordHash = await bcrypt.hash(password, 12)
  const admin = await prisma.adminUser.create({
    data: { username, email, passwordHash },
  })

  console.log(`\n✅ Akun admin berhasil dibuat:`)
  console.log(`   Username : ${admin.username}`)
  console.log(`   Email    : ${admin.email}`)
  console.log(`\nℹ️  Saat login, kode OTP akan dikirim ke email ${admin.email}\n`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
