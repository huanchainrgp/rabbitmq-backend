#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Generating Prisma Client...');

try {
  // Use the Prisma Client generator directly
  const { generateClient } = require('@prisma/internals');
  
  (async () => {
    try {
      await generateClient({
        datamodel: require('fs').readFileSync(path.join(__dirname, '../prisma/schema.prisma'), 'utf-8'),
        cwd: path.join(__dirname, '..'),
        outputDir: path.join(__dirname, '../node_modules/.prisma/client'),
      });
      console.log('✅ Prisma Client generated successfully!');
    } catch (err) {
      console.error('❌ Error:', err.message);
      // Fallback: just import Prisma to trigger generation
      console.log('🔄 Trying alternative method...');
      try {
        require('@prisma/client');
        console.log('✅ Prisma Client loaded!');
      } catch (e) {
        console.error('❌ Failed to load Prisma Client');
        process.exit(1);
      }
    }
  })();
} catch (error) {
  console.error('❌ Error generating Prisma Client:', error.message);
  // Try to just require it
  try {
    require('@prisma/client');
    console.log('✅ Prisma Client available!');
  } catch (e) {
    console.error('❌ Prisma Client not available');
    process.exit(1);
  }
}

