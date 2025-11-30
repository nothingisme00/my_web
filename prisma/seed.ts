import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Get admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Validate admin password is set
  if (!adminPassword) {
    throw new Error(
      'ADMIN_PASSWORD must be set in .env file for security. ' +
      'Please add: ADMIN_PASSWORD="your-strong-password-here"'
    );
  }

  // Warn if using default email
  if (adminEmail === 'admin@example.com') {
    console.warn('⚠️  WARNING: Using default admin email. Set ADMIN_EMAIL in .env for production!');
  }

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
