# 🗄️ Prisma + PostgreSQL Integration

## ✅ Setup Completed

### Database Configuration

- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Prisma v6.17.1
- **Connection**: Pooled connection with SSL

### Connection String
```
postgresql://neondb_owner:npg_fKNT7GeL0YJO@ep-plain-heart-adfo87lf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 📦 What's Installed

1. **@prisma/client** - Prisma Client for database queries
2. **prisma** - Prisma CLI for migrations and schema management

## 🏗️ Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## 📁 Files Created/Modified

### New Files
1. ✅ `prisma/schema.prisma` - Database schema
2. ✅ `prisma/migrations/` - Migration history
3. ✅ `src/prisma/prisma.service.ts` - Prisma service for NestJS
4. ✅ `src/prisma/prisma.module.ts` - Prisma module (Global)

### Modified Files
1. ✅ `.env` - Added DATABASE_URL
2. ✅ `src/app.module.ts` - Added PrismaModule
3. ✅ `src/users/users.service.ts` - Updated to use Prisma
4. ✅ `package.json` - Added Prisma scripts

## 🔄 Changes Made

### UsersService (src/users/users.service.ts)

**Before**: In-memory storage (array)
```typescript
private users: User[] = [];
```

**After**: PostgreSQL with Prisma
```typescript
constructor(private prisma: PrismaService) {}

async create(email, username, password) {
  const newUser = await this.prisma.user.create({
    data: { email, username, password: hashedPassword },
  });
  return newUser;
}
```

### Benefits
- ✅ **Persistent Storage** - Data saved to PostgreSQL
- ✅ **Type Safety** - Auto-generated types
- ✅ **Migrations** - Version controlled schema changes
- ✅ **Relationships** - Easy to add relations later
- ✅ **Performance** - Optimized queries

## 🚀 Usage

### Start Development Server
```bash
yarn start:dev
```

The Prisma Client will be automatically generated on first run.

### Run Migrations
```bash
yarn prisma:migrate
# or
yarn exec prisma migrate dev --name your_migration_name
```

### Open Prisma Studio (Database GUI)
```bash
yarn prisma:studio
# or  
yarn exec prisma studio
```

This opens a web interface at http://localhost:5555 to view/edit data.

### Generate Prisma Client Manually
```bash
yarn prisma:generate
# or
yarn exec prisma generate
```

## 📊 Database Operations

### Create User (Already Working)
```typescript
// POST /auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

The user is now saved to PostgreSQL database!

### Query Users
```typescript
// In any service:
constructor(private prisma: PrismaService) {}

// Find all users
const users = await this.prisma.user.findMany();

// Find by email
const user = await this.prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Update user
const updated = await this.prisma.user.update({
  where: { id: 'user-id' },
  data: { username: 'newname' }
});

// Delete user
await this.prisma.user.delete({
  where: { id: 'user-id' }
});
```

## 🔧 Prisma Commands

| Command | Description |
|---------|-------------|
| `yarn prisma:generate` | Generate Prisma Client |
| `yarn prisma:migrate` | Create and run migrations |
| `yarn prisma:studio` | Open database GUI |
| `yarn exec prisma db push` | Push schema changes without migration |
| `yarn exec prisma db pull` | Pull schema from existing database |
| `yarn exec prisma format` | Format schema file |

## 📝 Example Migration

When you change the schema:

1. **Edit** `prisma/schema.prisma`
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  password  String
  firstName String?  // New field
  lastName  String?  // New field
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

2. **Run migration**
```bash
yarn exec prisma migrate dev --name add_user_names
```

3. **Prisma Client auto-updates** with new fields!

## ✅ Verification

To verify PostgreSQL is working:

```bash
# 1. Start server
yarn start:dev

# 2. Register a user
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@postgres.com",
    "username": "testuser",
    "password": "test123456"
  }'

# 3. Check Prisma Studio
yarn prisma:studio
# Open http://localhost:5555
# Navigate to "User" table
# You should see the registered user!
```

## 🎯 Next Steps

1. ✅ Users are now saved to PostgreSQL
2. ✅ RabbitMQ still pushes messages on registration
3. ✅ JWT authentication working
4. ✅ Data persists across server restarts

### Future Enhancements

- Add more models (Posts, Comments, etc.)
- Add relationships between models
- Add soft deletes
- Add full-text search
- Add database indexes for performance

## 🐛 Troubleshooting

### "PrismaClient is not generated"

Run:
```bash
yarn exec prisma generate
```

### "Can't reach database server"

Check:
1. DATABASE_URL in `.env` is correct
2. Internet connection working
3. Neon.tech database is active

### Migration Errors

Reset database (CAUTION: Deletes all data):
```bash
yarn exec prisma migrate reset
```

---

**Status**: ✅ PostgreSQL + Prisma integrated successfully!  
**Database**: Neon.tech PostgreSQL  
**Table**: `users` created  
**Migration**: `20251020070440_init` applied
