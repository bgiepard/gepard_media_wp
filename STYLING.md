# Jak ostylować Next.js żeby wyglądał profesjonalnie

## Problem z "AI-look"

Strony generowane przez AI wyglądają podobnie bo używają tych samych domyślnych wyborów:
- niebieski `#3B82F6` jako główny kolor
- Zaokrąglone karty z `shadow-md`
- Inter jako jedyny font
- Brak własnego charakteru — każda sekcja wygląda jak szablon

Profesjonalna strona ma **własną osobowość** i spójny system wizualny.

---

## 1. Typografia — największy wpływ na wygląd

Font to 70% odbioru projektu. Złe dobranie fontów = natychmiastowe wrażenie "budżetowości".

### Dobre pary fontów (konkretne rekomendacje)

**Dla agencji / portfolio / luksus:**
```
Nagłówki: Fraunces (Google Fonts) — serif z charakterem
Tekst:    DM Sans — nowoczesny, czytelny
```

**Dla e-commerce / sklep:**
```
Nagłówki: Cabinet Grotesk (Fontshare — darmowy)
Tekst:    Satoshi (Fontshare — darmowy)
```

**Dla bloga / treść:**
```
Nagłówki: Playfair Display
Tekst:    Source Serif 4
```

**Neutral, zawsze działa:**
```
Nagłówki: Plus Jakarta Sans (gruba waga 700-800)
Tekst:    Plus Jakarta Sans (waga 400-500)
```

### Jak zainstalować przez next/font

```tsx
// layout.tsx
import { Fraunces, DM_Sans } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-heading' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
```

### Zasady typografii

- Nagłówki: duże i odważne (`text-5xl font-bold` to minimum dla hero)
- Line-height tekstu: `leading-relaxed` lub `leading-loose` — nigdy domyślne
- Letter-spacing nagłówków: lekko ujemny (`tracking-tight`)
- Kontrast: ciemny tekst na białym tle = `#111` nie `#000`, szary = `#6B7280` nie jaśniejszy

---

## 2. shadcn/ui — jedyna biblioteka komponentów godna polecenia

Nie jest to "biblioteka" w tradycyjnym sensie — to kolekcja komponentów które **kopiujesz do projektu** i masz pełną kontrolę nad kodem. Zbudowana na Radix UI (dostępność) + Tailwind.

### Dlaczom nie inne biblioteki

| Biblioteka | Problem |
|---|---|
| Material UI | Wygląda jak Google, ciężka, trudna do customizacji |
| Chakra UI | Przestarzały design, wolna |
| Ant Design | Bardzo "korporacyjna", chiński styl |
| **shadcn/ui** | Twój kod, pełna kontrola, profesjonalny wygląd |

### Instalacja

```bash
npx shadcn@latest init
npx shadcn@latest add button input card dialog sheet
```

### Najważniejsze komponenty dla sklepu/bloga

```bash
npx shadcn@latest add button        # przyciski
npx shadcn@latest add input         # pola formularzy
npx shadcn@latest add card          # karty produktów
npx shadcn@latest add sheet         # boczny panel (koszyk slide-in)
npx shadcn@latest add dialog        # modale
npx shadcn@latest add badge         # etykiety (Nowy, Wyprzedaż)
npx shadcn@latest add separator     # linie podziału
npx shadcn@latest add skeleton      # loading placeholdery
npx shadcn@latest add breadcrumb    # nawigacja okruszkowa
```

---

## 3. Animacje — Framer Motion

Subtelne animacje to różnica między "statyczną stroną" a "premium produktem".

```bash
npm install framer-motion
```

### Konkretne animacje które działają (nie przesadzaj)

**Fade-in przy scrollu:**
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

**Hover na karcie produktu:**
```tsx
<motion.article
  whileHover={{ y: -4 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
```

**Page transition:**
```tsx
<motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

### Czego NIE robić

- Nie animuj każdego elementu
- Nie używaj `bounce` ani `rotate` bez powodu
- Czas trwania: 200-500ms — dłużej = irytujące
- `once: true` w viewport — animacja odpala się raz

---

## 4. Paleta kolorów — mniej znaczy więcej

Profesjonalne sklepy używają max 2 kolorów + neutralne.

### Sprawdzone palety

**Monochromatyczna (najszybciej wygląda dobrze):**
```
Tło:        #FAFAFA
Tekst:      #111111
Akcent:     #111111 (tak, ten sam — wszystko jest B&W)
Muted:      #71717A
```

**Zieleń premium (organiczne, eko, wellness):**
```
Akcent:     #2D6A4F
Jasny:      #D8F3DC
Neutralny:  #1B1B1B
```

**Głęboki granat (luksus, technologia):**
```
Akcent:     #1E3A5F
Jasny:      #EEF4FF
Neutralny:  #0F172A
```

### Jak zdefiniować w Tailwind

```css
/* globals.css */
:root {
  --color-accent: #2D6A4F;
  --color-accent-light: #D8F3DC;
  --color-foreground: #111111;
  --color-muted: #71717A;
}
```

---

## 5. Spacing i layout — sekrety białej przestrzeni

Amatorskie strony są "ciasne". Profesjonalne mają oddech.

```
Padding sekcji:    py-24 md:py-32  (nie py-8)
Gap między kartami: gap-6 md:gap-8
Max-width:         max-w-7xl (nie max-w-6xl dla sklepów)
Margines wewnętrzny: px-4 sm:px-6 lg:px-8
```

---

## 6. Inspiracje — gdzie szukać

- **Awwwards.com** — najlepsze strony świata
- **Screenlane.com** — screenshoty UI e-commerce i SaaS
- **Landingfolio.com** — landing pages
- **Mobbin.com** — mobile UI patterns
- **Cosmos.so** — agregator inspo

Szukaj: "headless commerce nextjs", "minimal ecommerce ui", "editorial store design"

---

## 7. Kolejność wdrażania

1. **Font** — zmień font, od razu wygląda 30% lepiej
2. **Kolory** — zdefiniuj spójną paletę, usuń losowe kolory
3. **shadcn/ui** — zastąp własne komponenty (przyciski, inputy, karty)
4. **Spacing** — zwiększ padding sekcji i gap
5. **Framer Motion** — dodaj subtelne animacje jako ostatni krok

Nie wdrażaj wszystkiego naraz — każda zmiana powinna mieć cel.
