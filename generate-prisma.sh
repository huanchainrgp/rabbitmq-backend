#!/bin/bash
# Generate Prisma Client
cd "$(dirname "$0")"

echo "🔄 Generating Prisma Client..."

# Use node to run prisma through yarn
yarn node --loader ./.pnp.loader.mjs --require ./.pnp.cjs ./node_modules/prisma/build/index.js generate

echo "✅ Prisma Client generated!"
