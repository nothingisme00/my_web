import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking profile image in database...');

  const existingData = await prisma.settings.findUnique({
    where: { key: 'about_page_content' }
  });

  if (!existingData) {
    console.log('❌ No about_page_content setting found in database');
    console.log('   Please use the admin panel at /admin/about to configure your profile');
    return;
  }

  try {
    const data = JSON.parse(existingData.value);

    if (data.profileImage && data.profileImage.trim() !== '') {
      console.log('✅ Profile image already configured:', data.profileImage);
      console.log('   No action needed');
      return;
    }

    // Set default profile image - adjust this path to your actual uploaded profile image
    const defaultProfileImage = '/uploads/profile-1763726692349.png';

    data.profileImage = defaultProfileImage;

    await prisma.settings.update({
      where: { key: 'about_page_content' },
      data: { value: JSON.stringify(data) }
    });

    console.log('✅ Profile image updated successfully!');
    console.log('   New profile image:', defaultProfileImage);
    console.log('');
    console.log('📝 Note: You can change this at any time via /admin/about');

  } catch (error) {
    console.error('❌ Error parsing or updating settings:', error);
    console.log('   Please check your database manually');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
