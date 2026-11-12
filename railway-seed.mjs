// First boot only: create a verified owner account from HEYFORM_ADMIN_EMAIL and
// HEYFORM_ADMIN_PASSWORD. HeyForm otherwise asks every new account to verify
// its email, which needs SMTP, and public sign-up is off by default here.
// Does nothing once any user exists.
import { createRequire } from 'module';

const require = createRequire('/app/packages/server/');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const email = (process.env.HEYFORM_ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.HEYFORM_ADMIN_PASSWORD || '';
if (!email || !password) {
  console.log('railway-seed: HEYFORM_ADMIN_EMAIL or HEYFORM_ADMIN_PASSWORD not set, skipping');
  process.exit(0);
}

const port = process.env.APP_LISTEN_PORT || '9157';
let up = false;
for (let i = 0; i < 180 && !up; i++) {
  try {
    up = (await fetch(`http://127.0.0.1:${port}/health`)).ok;
  } catch {}
  if (!up) await new Promise((r) => setTimeout(r, 1000));
}
if (!up) {
  console.error('railway-seed: HeyForm did not become healthy, skipping');
  process.exit(1);
}

const conn = await mongoose.createConnection(process.env.MONGO_URI).asPromise();
try {
  const users = conn.collection('usermodels');
  if ((await users.countDocuments()) > 0) {
    console.log('railway-seed: users already exist, nothing to do');
  } else {
    const now = new Date();
    await users.insertOne({
      name: process.env.HEYFORM_ADMIN_NAME || 'Admin',
      email,
      password: await bcrypt.hash(password, Number(process.env.BCRYPT_SALT) || 10),
      avatar: '',
      lang: 'en',
      isEmailVerified: true,
      isDeletionScheduled: false,
      deletionScheduledAt: 0,
      isBlocked: false,
      lastCheckedAt: 0,
      publishedFormAt: 0,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`railway-seed: created verified account ${email}`);
  }
} finally {
  await conn.close();
}
