import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default test accountant user
    const testAccountantEmail = 'ihab@taxflowai.com';
    const testPassword = 'TaxFlow2024!';
    
    console.log(`Creating/updating test accountant: ${testAccountantEmail}`);
    
    // Hash the password
    const passwordHash = await bcrypt.hash(testPassword, 12);
    
    // Use upsert to avoid duplicates
    const accountant = await prisma.accountant.upsert({
      where: { email: testAccountantEmail },
      update: {
        passwordHash,
        firmName: 'TaxFlowAI',
        phone: '+1-514-555-1234',
        languagePref: 'en',
      },
      create: {
        email: testAccountantEmail,
        passwordHash,
        firmName: 'TaxFlowAI',
        phone: '+1-514-555-1234',
        languagePref: 'en',
      },
    });
    
    console.log('✅ Test accountant created/updated successfully');
    console.log(`   ID: ${accountant.id}`);
    console.log(`   Email: ${accountant.email}`);
    console.log(`   Firm: ${accountant.firmName}`);
    console.log(`   Language: ${accountant.languagePref}`);
    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
