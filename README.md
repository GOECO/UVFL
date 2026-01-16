
# UVFL Global Repository

## Directory Structure
- `/api`: NestJS Backend (Rule Engine, Ledger)
- `/web`: Next.js Platform (Public, Authenticated)
- `/admin`: Admin Console (Rule Management)
- `/mobile`: Flutter App (iOS/Android)
- `/docs`: Architecture and Compliance Specs

## Local Setup

### 1. Backend
```bash
cd api
npm install
# Configure DATABASE_URL in .env
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### 2. Web Platform
```bash
cd web
npm install
npm run dev
```

### 3. Mobile (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

## Key Modules
- **Compliance Engine**: Located in `api/src/compliance`. Handles tax/customs logic.
- **Ledger System**: Located in `api/src/ledger`. Append-only audit trails.
- **Cycle Engine**: Cron jobs for Role Renewals (Creator -> Guide, etc.).

## Legal Disclaimer
This system provides **Tax Estimates** only. It does not provide legal advice or facilitate tax evasion. All configurations must be audited against local regulations.
