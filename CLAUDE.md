# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # development server (localhost:3000)
npm run build    # production build (runs TypeScript check)
npm run lint     # ESLint
npm run start    # start production build locally
```

For Stripe webhook testing locally, run in a second terminal:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Architecture

**Headless WordPress + Next.js 16 App Router + WooCommerce + Stripe**

- WordPress CMS lives at `cms.gepard.media` — never accessed by end users
- Next.js frontend at `gepard.media` — deployed on Vercel
- All data fetching is server-side (Server Components) with `revalidate: 60`

### Data layer

| File | Purpose |
|---|---|
| `src/lib/wordpress.ts` | WP REST API (`/wp/v2`) — posts, slugs |
| `src/lib/woocommerce.ts` | WC REST API (`/wc/v3`) — products, orders; uses Basic Auth |
| `src/lib/stripe.ts` | Server-side Stripe client |

WooCommerce uses Basic Auth (Consumer Key + Secret). WordPress REST API is public (no auth).

### Cart

Cart state lives in `src/context/CartContext.tsx` (React Context + `localStorage`). It is a client-side only concern — never sent to the server until checkout. `CartProvider` is mounted in `src/components/Providers.tsx`, which wraps the layout.

### Checkout / payment flow

1. `/koszyk` — user reviews cart, clicks "Zamów" → navigates to `/checkout`
2. `/checkout` — collects billing data, POSTs to `/api/checkout`
3. `/api/checkout/route.ts` — creates WooCommerce order (status: `pending`) + Stripe PaymentIntent, returns `clientSecret`
4. Stripe Elements confirm payment → Stripe redirects to `/zamowienie/sukces?order_id=xxx`
5. `/api/stripe/webhook/route.ts` — on `payment_intent.succeeded`, updates WC order to `processing`

### Environment variables

```
WP_API_URL                        # https://cms.gepard.media/wp-json/wp/v2
WC_CONSUMER_KEY                   # ck_...
WC_CONSUMER_SECRET                # cs_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY # pk_...
STRIPE_SECRET_KEY                 # sk_...
STRIPE_WEBHOOK_SECRET             # whsec_... (different value locally vs production)
```

### Images

All `<img>` tags use `next/image` with `fill` + `sizes` for automatic WebP and responsive loading. Remote images from `cms.gepard.media` are allowed via `remotePatterns` in `next.config.ts`. Product and post pages use `generateStaticParams` for build-time pre-rendering and `generateMetadata` for per-page SEO.
