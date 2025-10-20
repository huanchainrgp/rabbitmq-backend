#!/usr/bin/env node

// Workaround script to generate Prisma Client in Yarn PnP environment
const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Generating Prisma Client (Yarn PnP mode)...\n');

// Set environment to skip problematic postinstall
process.env.PRISMA_SKIP_POSTINSTALL_GENERATE = '1';
process.env.PRISMA_GENERATE_SKIP_AUTOINSTALL = 'true';

// Find the prisma binary in the unplugged folder
const prismaPath = path.join(__dirname, '../.yarn/unplugged');

const prisma = spawn('sh', ['-c', `find "${prismaPath}" -name prisma -path "*/bin/*" | head -1 | xargs -I {} {} generate --skip-generate || echo "Failed, trying alternative..."; find "${prismaPath}" -name prisma -path "*/bin/*" | head -1 | xargs -I {} {} generate`], {
  stdio: 'inherit',
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL || '',
  }
});

prisma.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Prisma Client generated successfully!');
  } else {
    console.log('\n⚠️  Generation completed with code:', code);
    console.log('If you see errors, the client may still work. Try running the app.');
  }
  process.exit(code);
});

prisma.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
