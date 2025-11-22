import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123'; // Change this to a secure password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Updating password...');
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        name: 'Administrator',
      },
    });
    console.log('Admin user updated successfully!');
  } else {
    console.log('Creating admin user...');
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrator',
      },
    });
    console.log('Admin user created successfully!');
  }

  console.log('\n=================================');
  console.log('Admin Credentials:');
  console.log('Email:', adminEmail);
  console.log('Password:', adminPassword);
  console.log('=================================');
  console.log('\nIMPORTANT: Change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
