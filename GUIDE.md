# Next.js + WordPress (Headless CMS) + Vercel — przewodnik krok po kroku

## Stack i wybory technologiczne

### Czym jest "headless WordPress"?
WordPress działa tylko jako backend (panel admina + baza danych). Next.js pobiera dane przez API i renderuje frontend. Użytkownik widzi stronę Next.js, nigdy WordPressa.

---

## 1. Wybór bibliotek i serwisów

### WordPress hosting (wybierz jedno)
| Opcja | Kiedy użyć | Koszt |
|---|---|---|
| **Local by Flywheel** | Development lokalny | Darmowy |
| **Hetzner VPS** (self-hosted) | Produkcja, pełna kontrola | ~5€/mies |
| **WP Engine / Kinsta** | Produkcja, bez DevOps | od ~25$/mies |
| **Instawp.com** | Szybki prototyp/dev | Darmowy plan |

### Komunikacja WordPress ↔ Next.js (wybierz jedno)
| Opcja | Zalety | Wady |
|---|---|---|
| **WordPress REST API** (wbudowane) | Zero konfiguracji w WP, proste | Wolniejsze, więcej requestów |
| **WPGraphQL** (plugin) | Jeden request, elastyczne zapytania | Wymaga instalacji pluginu |

**Rekomendacja:** WPGraphQL + `graphql-request` — jedno zapytanie zamiast wielu.

### Biblioteki Next.js
```
next                    # framework
graphql-request         # klient GraphQL (lekki, bez boilerplate)
# LUB przy REST API — samo fetch() z Next.js, bez dodatkowych bibliotek
```

### Opcjonalnie przydatne
```
tailwindcss             # stylowanie
next-seo                # meta tagi SEO
date-fns                # formatowanie dat
@next/font              # optymalizacja fontów
```

---

## 2. Konfiguracja WordPress

### Krok 1 — Zainstaluj WordPress
Lokalnie: pobierz [Local by Flywheel](https://localwp.com/), utwórz nowy site.

### Krok 2 — Zainstaluj wymagane pluginy
W panelu WP → Pluginy → Dodaj nowy:
- **WPGraphQL** — `wp-graphql` (główny plugin GraphQL)
- **WPGraphQL for ACF** — jeśli używasz Advanced Custom Fields
- **JWT Authentication for WP REST API** — jeśli potrzebujesz autoryzacji

Po instalacji WPGraphQL: WP → GraphQL → Settings → sprawdź endpoint (domyślnie `/graphql`).

### Krok 3 — Skonfiguruj CORS (dla produkcji)
W pliku `wp-config.php` lub przez plugin dodaj:
```php
// wp-config.php
header("Access-Control-Allow-Origin: https://twoja-domena.vercel.app");
```

Lub zainstaluj plugin **WP CORS**.

### Krok 4 — Włącz revalidację przez webhooki
WP → Ustawienia → Permalinks → wybierz strukturę (np. `/%postname%/`) i zapisz.

---

## 3. Tworzenie projektu Next.js

```bash
npx create-next-app@latest wp-next --typescript --tailwind --app --src-dir
cd wp-next
npm install graphql-request
```

### Struktura katalogów
```
src/
  app/
    page.tsx              # strona główna (lista postów)
    posts/
      [slug]/
        page.tsx          # pojedynczy post
    layout.tsx
  lib/
    graphql.ts            # klient GraphQL + zapytania
  types/
    wordpress.ts          # typy TypeScript
```

---

## 4. Połączenie z WordPress

### `src/lib/graphql.ts`
```typescript
import { GraphQLClient } from 'graphql-request'

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL!

export const client = new GraphQLClient(WP_GRAPHQL_URL)

export const GET_POSTS = `
  query GetPosts {
    posts(first: 10) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`

export const GET_POST_BY_SLUG = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      date
      author {
        node { name }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`
```

### `src/types/wordpress.ts`
```typescript
export interface WPPost {
  id: string
  slug: string
  title: string
  date: string
  excerpt: string
  featuredImage?: {
    node: { sourceUrl: string; altText: string }
  }
}

export interface WPPostFull extends WPPost {
  content: string
  author: { node: { name: string } }
}
```

---

## 5. Strony Next.js

### `src/app/page.tsx` — lista postów
```typescript
import { client, GET_POSTS } from '@/lib/graphql'
import { WPPost } from '@/types/wordpress'
import Link from 'next/link'

export const revalidate = 60 // ISR: odświeżaj co 60 sekund

export default async function HomePage() {
  const data = await client.request<{ posts: { nodes: WPPost[] } }>(GET_POSTS)
  const posts = data.posts.nodes

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      {posts.map(post => (
        <article key={post.id} className="mb-8 border-b pb-8">
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
          </Link>
          <time className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('pl-PL')}</time>
          <div dangerouslySetInnerHTML={{ __html: post.excerpt }} className="mt-2 text-gray-700" />
        </article>
      ))}
    </main>
  )
}
```

### `src/app/posts/[slug]/page.tsx` — pojedynczy post
```typescript
import { client, GET_POST_BY_SLUG } from '@/lib/graphql'
import { WPPostFull } from '@/types/wordpress'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function PostPage({ params }: { params: { slug: string } }) {
  const data = await client.request<{ post: WPPostFull | null }>(
    GET_POST_BY_SLUG,
    { slug: params.slug }
  )

  if (!data.post) notFound()

  const post = data.post

  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {new Date(post.date).toLocaleDateString('pl-PL')} · {post.author.node.name}
      </p>
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
```

---

## 6. Zmienne środowiskowe

### `.env.local` (lokalnie)
```env
WP_GRAPHQL_URL=http://localhost:10004/graphql
# Zamień port na ten z Local by Flywheel
```

### Na Vercel (krok 9) dodaj:
```env
WP_GRAPHQL_URL=https://twoj-wordpress.com/graphql
```

---

## 7. ISR i rewalidacja on-demand

### Automatyczna rewalidacja (ISR)
`export const revalidate = 60` w pliku strony — Next.js odbuduje stronę najwyżej raz na 60s.

### Rewalidacja po zapisaniu posta w WP (on-demand)
Utwórz endpoint w Next.js:

**`src/app/api/revalidate/route.ts`**
```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/posts/[slug]', 'page')

  return NextResponse.json({ revalidated: true })
}
```

Dodaj do `.env`:
```env
REVALIDATE_SECRET=twoj-tajny-klucz
```

W WordPressie zainstaluj plugin **WP Webhooks** i skonfiguruj POST na:
```
https://twoja-domena.vercel.app/api/revalidate?secret=twoj-tajny-klucz
```

---

## 8. Deployment na Vercel

### Krok 1 — Push na GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/twoj-user/wp-next.git
git push -u origin main
```

### Krok 2 — Podłącz Vercel
1. Wejdź na [vercel.com](https://vercel.com) → **Add New Project**
2. Importuj repozytorium z GitHub
3. Framework Preset: **Next.js** (wykryje automatycznie)
4. Dodaj zmienne środowiskowe:
   - `WP_GRAPHQL_URL` = URL do GraphQL Twojego WordPress
   - `REVALIDATE_SECRET` = tajny klucz

### Krok 3 — Deploy
Kliknij **Deploy**. Vercel zbuduje projekt i wyda URL produkcyjny.

Każdy `git push` do `main` = automatyczny redeploy.

---

## 9. Checklist — co zrobić w jakiej kolejności

- [ ] Zainstaluj Local by Flywheel i utwórz lokalny WordPress
- [ ] Zainstaluj plugin WPGraphQL w WordPressie
- [ ] `npx create-next-app@latest` + `npm install graphql-request`
- [ ] Utwórz `src/lib/graphql.ts` z klientem i zapytaniami
- [ ] Utwórz strony `page.tsx` i `posts/[slug]/page.tsx`
- [ ] Dodaj `.env.local` z lokalnym URL GraphQL
- [ ] Przetestuj lokalnie: `npm run dev`
- [ ] Utwórz repozytorium GitHub i zrób push
- [ ] Utwórz projekt na Vercel i podłącz repo
- [ ] Dodaj zmienne środowiskowe na Vercel
- [ ] Skonfiguruj webhook w WP → Vercel (rewalidacja on-demand)
- [ ] Ustaw własną domenę w Vercel (opcjonalnie)

---

## Podsumowanie stosu

| Warstwa | Technologia |
|---|---|
| Frontend framework | Next.js 14+ (App Router) |
| Stylowanie | Tailwind CSS |
| CMS | WordPress (headless) |
| API | WPGraphQL |
| Klient GraphQL | graphql-request |
| Hosting WordPress | Local (dev) / Hetzner VPS (prod) |
| Hosting Next.js | Vercel |
| Rewalidacja | ISR + on-demand via webhooks |
