# Next.js + WordPress Headless CMS + WooCommerce + Stripe

Frontend w Next.js pobiera dane z WordPressa przez REST API. Użytkownik widzi wyłącznie stronę Next.js — WordPress działa tylko jako panel administracyjny i nigdy nie jest dostępny pod domeną główną.

## Architektura

```
gepard.media          →  Next.js (Vercel)        — frontend widoczny dla użytkowników
cms.gepard.media      →  WordPress + WooCommerce  — panel admina, niewidoczny dla użytkowników
```

Dane płyną tylko w jedną stronę: WordPress → REST API → Next.js → użytkownik.

---

## Wdrożenie na nowym projekcie / serwerze

### 1. Przygotowanie subdomeny dla WordPressa

Na hostingu klienta utwórz subdomenę `cms.domena.pl` i zainstaluj na niej WordPress. Subdomena może być na dowolnym hostingu — jedynym wymaganiem jest dostęp przez HTTPS i możliwość instalacji wtyczek.

**Wymagania hostingu:**
- PHP 8.1+
- MySQL 5.7+ lub MariaDB 10.4+
- HTTPS (certyfikat SSL — większość hostingów oferuje Let's Encrypt za darmo)

### 2. Konfiguracja WordPress

Po instalacji WordPress:

**a) Ustaw bezpośrednie odnośniki**

Panel WP → Ustawienia → Bezpośrednie odnośniki → wybierz **Nazwa wpisu** → Zapisz zmiany.

Bez tego kroku REST API zwraca błąd 404.

**b) Wygeneruj klucze API WooCommerce**

Panel WP → WooCommerce → Ustawienia → Zaawansowane → REST API → **Dodaj klucz**

- Opis: `Next.js frontend`
- Użytkownik: administrator
- Uprawnienia: **Odczyt/Zapis** (wymagane do tworzenia zamówień)

Skopiuj `Consumer Key` (`ck_...`) i `Consumer Secret` (`cs_...`) — pokazują się tylko raz.

**c) Sprawdź czy REST API działa**

Wejdź w przeglądarce na:
```
https://cms.domena.pl/wp-json/wp/v2/posts
https://cms.domena.pl/wp-json/wc/v3/products
```

Pierwsze powinno zwrócić JSON z postami (publiczny). Drugie zwróci `401` bez autoryzacji — to prawidłowe zachowanie.

### 3. Konfiguracja DNS

W panelu DNS domeny głównej:

| Rekord | Typ | Zawartość | Uwagi |
|---|---|---|---|
| `@` lub `domena.pl` | A | IP podane przez Vercel | Frontend Next.js |
| `www` | CNAME | `cname.vercel-dns.com` | Opcjonalnie |
| `cms` | A | IP serwera hostingu | WordPress |

**Ważne:** jeśli w strefie DNS istnieje rekord wildcard (`*`), dodaj explicit rekord `cms` — ma on wyższy priorytet niż wildcard.

### 4. Konfiguracja Stripe

1. Utwórz konto na [stripe.com](https://stripe.com)
2. Przejdź do **Developers → API keys** i skopiuj:
   - `Publishable key` (`pk_live_...` lub `pk_test_...`)
   - `Secret key` (`sk_live_...` lub `sk_test_...`)
3. Przejdź do **Developers → Webhooks → Add endpoint**:
   - URL: `https://domena.pl/api/stripe/webhook`
   - Zdarzenie: `payment_intent.succeeded`
   - Skopiuj **Signing secret** (`whsec_...`)

### 5. Zmienne środowiskowe

Utwórz plik `.env.local` w katalogu projektu:

```env
WP_API_URL=https://cms.domena.pl/wp-json/wp/v2

WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Te same zmienne dodaj w panelu Vercel: **Project → Settings → Environment Variables**.

### 6. Deploy na Vercel

1. Wrzuć kod na GitHub
2. Połącz repozytorium z Vercel (importuj projekt)
3. Dodaj zmienne środowiskowe w panelu Vercel
4. Dodaj domenę: **Project → Settings → Domains → Add**
5. Vercel wygeneruje certyfikat SSL automatycznie

Każdy `git push` do `main` uruchamia automatyczny redeploy.

---

## Lokalne testowanie Stripe

Do testowania webhooków lokalnie zainstaluj [Stripe CLI](https://stripe.com/docs/stripe-cli), zaloguj się (`stripe login`) i uruchom w osobnym terminalu:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

CLI wypisze lokalny `whsec_...` — użyj go jako `STRIPE_WEBHOOK_SECRET` w `.env.local` podczas testów lokalnych (inny niż produkcyjny).

Testowa karta Stripe: `4242 4242 4242 4242`, data dowolna przyszła, CVC dowolne.

---

## Uruchomienie lokalne

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # sprawdza TypeScript i buduje produkcję
npm run lint
```

---

## Flow płatności

```
Koszyk → /checkout → POST /api/checkout
                          ↓
              Tworzy zamówienie WooCommerce (status: pending)
              Tworzy Stripe PaymentIntent
                          ↓
              Stripe Elements (formularz karty)
                          ↓
              Stripe przetwarza płatność
                          ↓
              Webhook: POST /api/stripe/webhook
                          ↓
              Zamówienie WooCommerce → status: processing
                          ↓
              Przekierowanie → /zamowienie/sukces
```
