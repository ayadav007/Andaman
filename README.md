# Andaman Ecstasy Pvt Ltd — Website

Tourism marketing site + admin CMS for **Andaman Ecstasy Pvt Ltd**.

Tagline: *Let your soul discover Andaman… an island of God…*

## Local setup (no Docker)

Uses **SQLite** locally (`dev.db`). For Hostinger MySQL later: set Prisma `provider = "mysql"` and `DATABASE_URL`.

```bash
npm install
npm run db:setup
npm run dev
```

- Public: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  
- Password: `admin123` (`.env` → `ADMIN_PASSWORD`)

## Admin features (built)

- Dashboard, bookings, leads  
- Itinerary / quote → printable PDF + WhatsApp share  
- Packages (create/edit + hotel stays)  
- Hotels + room types (with image upload)  
- Home sections (reorder / hide / edit items)  
- FAQ, testimonials, blog, stats  
- Media library + logo/hero upload  
- Site settings (FABs, Maps, SEO, GA/Pixel, Tripadvisor embed, alert email)  
- Razorpay pay after booking (needs keys in `.env`) + invoice page  

## Env extras

See `.env.example` for SMTP and Razorpay.

## Hostinger MySQL later

1. Create MySQL in hPanel  
2. In `prisma/schema.prisma` change `provider` to `mysql`  
3. Set `DATABASE_URL=mysql://...`  
4. Adjust `src/lib/prisma.ts` to use MySQL adapter  
5. `npx prisma db push && npm run db:seed`
