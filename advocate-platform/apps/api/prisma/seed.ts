import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Super Admin ─────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log(`✅ Super Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Super Admin already exists: ${adminEmail}`);
  }

  // ─── Default Site Settings ───────────────────────────────────────────────────
  const defaultSettings = [
    { key: 'SITE_NAME', value: process.env.SITE_NAME || '[FIRM_NAME]' },
    { key: 'SITE_TAGLINE', value: process.env.SITE_TAGLINE || 'Expert Legal Counsel You Can Trust' },
    { key: 'CONTACT_EMAIL', value: process.env.CONTACT_EMAIL || 'contact@example.com' },
    { key: 'CONTACT_PHONE', value: process.env.CONTACT_PHONE || '+91 XXXXX XXXXX' },
    { key: 'OFFICE_ADDRESS', value: process.env.OFFICE_ADDRESS || '[Office Address], [City], [State]' },
    { key: 'WORKING_HOURS', value: 'Mon–Sat: 10:00 AM – 6:00 PM' },
    { key: 'PRIMARY_COLOR', value: process.env.PRIMARY_COLOR || '#000000' },
    { key: 'DEFAULT_SEO_TITLE', value: process.env.DEFAULT_SEO_TITLE || '[FIRM_NAME] — Expert Legal Services' },
    { key: 'DEFAULT_META_DESC', value: process.env.DEFAULT_META_DESC || '[FIRM_NAME] provides expert legal services.' },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Default site settings seeded');

  // ─── Default SEO Settings ─────────────────────────────────────────────────────
  const defaultSeoPages = [
    { pageKey: 'home', seoTitle: '[FIRM_NAME] — Expert Legal Counsel', metaDesc: 'Get expert legal representation for criminal, family, property, and civil law matters.' },
    { pageKey: 'about', seoTitle: 'About — [FIRM_NAME]', metaDesc: 'Learn about our Advocate\'s qualifications, experience, and legal expertise.' },
    { pageKey: 'contact', seoTitle: 'Contact Us — [FIRM_NAME]', metaDesc: 'Contact our law firm for a consultation. We\'re here to help with your legal needs.' },
    { pageKey: 'articles', seoTitle: 'Legal Articles & Resources — [FIRM_NAME]', metaDesc: 'Read expert legal articles on consumer law, family law, property law, and more.' },
    { pageKey: 'success-stories', seoTitle: 'Success Stories — [FIRM_NAME]', metaDesc: 'Read how we\'ve helped clients achieve successful legal outcomes.' },
  ];

  for (const page of defaultSeoPages) {
    await prisma.seoSettings.upsert({
      where: { pageKey: page.pageKey },
      update: {},
      create: page,
    });
  }
  console.log('✅ Default SEO settings seeded');

  // ─── Article Categories ───────────────────────────────────────────────────────
  const categories = [
    { name: 'Criminal Law', slug: 'criminal-law' },
    { name: 'Family Law', slug: 'family-law' },
    { name: 'Property Law', slug: 'property-law' },
    { name: 'Consumer Law', slug: 'consumer-law' },
    { name: 'Civil Law', slug: 'civil-law' },
    { name: 'Cyber Law', slug: 'cyber-law' },
    { name: 'Labour Law', slug: 'labour-law' },
    { name: 'Constitutional Law', slug: 'constitutional-law' },
  ];

  for (const cat of categories) {
    await prisma.articleCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Article categories seeded');

  console.log('\n🎉 Database seeding complete!');
  console.log(`\n📋 Admin credentials:`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`\n⚠️  IMPORTANT: Change the admin password immediately after first login!`);
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
