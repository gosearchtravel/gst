<!-- @format -->

# Environment Variables for Vercel Deployment

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### Database

```
DATABASE_URL="mysql://avnadmin:AVNS_YEROgwp7xmOSWtB3Ix1@gst-gosearchtravel.h.aivencloud.com:15659/defaultdb?ssl-mode=REQUIRED"
```

### Clerk Authentication

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWFpbi1yZWluZGVlci0xMi5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_8VEB088gnoeQq7kWChahsuUQDu2GrejCQelgG29C96
```

### Amadeus API (for flights)

```
AMADEUS_API_KEY=W0mwTTX9nosJJVyCLPdoNHGQoEYKQeEr
AMADEUS_API_SECRET=PKflxfy0KWRPK1qW
```

### Build Configuration

```
SKIP_ENV_VALIDATION=true
```

## Vercel Build Settings

In your Vercel project settings:

1. **Framework Preset**: Next.js
2. **Build Command**: `npm run build`
3. **Output Directory**: Leave empty (default .next)
4. **Install Command**: `npm install`
5. **Development Command**: `npm run dev`

## Notes

- The database connection should work from Vercel as it's using a cloud MySQL instance
- All API routes are configured as dynamic to avoid build-time database access
- The blog pages use dynamic routing to prevent build-time issues
