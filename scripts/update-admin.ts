/**
 * Script untuk mengupdate email atau password akun admin.
 * Jalankan: npm run admin:update
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

  console.log('\n🔧 SiRegFoto BPPSI UIKA — Update Akun Admin\n')

  // Tampilkan daftar admin
  const admins = await prisma.adminUser.findMany({
    select: { id: true, username: true, email: true, aktif: true },
    orderBy: { createdAt: 'asc' },
  })

  if (admins.length === 0) {
    console.log('Belum ada akun admin. Jalankan npm run admin:create terlebih dahulu.')
    process.exit(0)
  }

  console.log('Daftar akun admin:')
  admins.forEach((a, i) => {
    console.log(`  ${i + 1}. ${a.username} — ${a.email} ${a.aktif ? '' : '[nonaktif]'}`)
  })

  const usernameInput = (await rl.question('\nMasukkan username yang ingin diupdate: ')).trim()
  const user = admins.find(a => a.username === usernameInput)

  if (!user) {
    console.error(`❌ Username '${usernameInput}' tidak ditemukan.`)
    process.exit(1)
  }

  console.log(`\nUpdate akun: ${user.username} (${user.email})`)
  console.log('Kosongkan untuk tidak mengubah.\n')

  const newEmail    = (await rl.question('Email baru  : ')).trim()
  const newPassword = (await rl.question('Password baru (min 8 karakter, kosongkan untuk skip): ')).trim()
  rl.close()

  const updateData: Record<string, unknown> = {}

  if (newEmail) {
    if (!newEmail.includes('@')) { console.error('❌ Email tidak valid'); process.exit(1) }
    const existing = await prisma.adminUser.findUnique({ where: { email: newEmail } })
    if (existing && existing.id !== user.id) {
      console.error(`❌ Email '${newEmail}' sudah digunakan akun lain`)
      process.exit(1)
    }
    updateData.email = newEmail
  }

  if (newPassword) {
    if (newPassword.length < 8) { console.error('❌ Password minimal 8 karakter'); process.exit(1) }
    updateData.passwordHash = await bcrypt.hash(newPassword, 12)
  }

  if (Object.keys(updateData).length === 0) {
    console.log('\nℹ️  Tidak ada perubahan.')
    process.exit(0)
  }

  await prisma.adminUser.update({ where: { id: user.id }, data: updateData })

  console.log(`\n✅ Akun '${user.username}' berhasil diupdate:`)
  if (updateData.email)        console.log(`   Email    : ${updateData.email}`)
  if (updateData.passwordHash) console.log(`   Password : (diperbarui)`)
  console.log()
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
