import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';
import { ENV } from '../config/env.js';

/**
 * Super Admin Bootstrap Script
 * Usage:
 *   npx tsx src/scripts/bootstrap_admin.ts
 * Or with custom env:
 *   ADMIN_DEFAULT_EMAIL="admin@aditinitinwedding.com" ADMIN_DEFAULT_PASSWORD="YourSecurePassword" npx tsx src/scripts/bootstrap_admin.ts
 */
async function bootstrapAdmin() {
  console.log('--- Initializing Secure Admin Bootstrap Procedure ---');
  await connectDB();

  const email = (process.env.BOOTSTRAP_EMAIL || ENV.ADMIN_DEFAULT_EMAIL).toLowerCase().trim();
  const password = process.env.BOOTSTRAP_PASSWORD || ENV.ADMIN_DEFAULT_PASSWORD;
  const name = process.env.BOOTSTRAP_NAME || ENV.ADMIN_DEFAULT_NAME;

  if (!email || !password) {
    console.error('❌ Error: Admin email and password must be provided.');
    process.exit(1);
  }

  let admin = await Admin.findOne({ email });

  if (admin) {
    console.log(`ℹ️ Admin account already exists for ${email}. Verifying status...`);
    admin.role = 'SUPER_ADMIN';
    admin.isActive = true;
    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    if (process.env.RESET_PASSWORD === 'true') {
      admin.passwordHash = await bcrypt.hash(password, 10);
      console.log('🔑 Password reset successfully for Super Admin.');
    }
    await admin.save();
    console.log(`✅ Super Admin verified and active: ${admin.email}`);
  } else {
    console.log(`Creating new Super Admin for: ${email}`);
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await Admin.create({
      name,
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      failedLoginAttempts: 0,
    });
    console.log(`✅ New Super Admin successfully created: ${admin.email}`);
  }

  console.log('--- Bootstrap Procedure Complete ---');
  process.exit(0);
}

bootstrapAdmin().catch((err) => {
  console.error('❌ Bootstrap failed with error:', err);
  process.exit(1);
});
