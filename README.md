# Olio della Contrada

Blog aziendale per azienda agricola produttrice di olio extravergine d'oliva.

## Stack Tecnologico

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Autenticazione**: Supabase Auth
- **Styling**: Tailwind CSS
- **Editor**: Tiptap (WYSIWYG)
- **Deploy**: Vercel

## Setup Iniziale

### 1. Database Supabase

Esegui lo script SQL fornito nel file `database-schema.sql` nel SQL Editor di Supabase.

### 2. Bucket Storage

Assicurati di avere un bucket pubblico chiamato `media` su Supabase Storage.

### 3. Variabili Ambiente

Crea un file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=your_production_url
```

### 4. Installazione Dipendenze

```bash
npm install
```

### 5. Deploy su Vercel

1. Push del codice su GitHub
2. Importa il progetto su Vercel
3. Aggiungi le variabili ambiente nel pannello Vercel
4. Deploy automatico

## Funzionalità

### Area Pubblica
- Homepage con hero dinamico
- Lista articoli con filtri per tag
- Pagine articolo complete
- Iscrizione newsletter
- Pagine Privacy e Cookie

### Dashboard Admin
- Login protetto
- Gestione post (crea, modifica, elimina)
- Editor WYSIWYG con upload immagini e embed YouTube
- Gestione tags con colori personalizzati
- Gestione pagine statiche
- Lista iscritti newsletter con export CSV
- Impostazioni sito (logo, hero, analytics)

## Struttura Progetto

```
├── app/
│   ├── admin/          # Dashboard amministrazione
│   ├── api/            # API routes
│   ├── page/           # Pagine statiche
│   ├── post/           # Articoli blog
│   └── unsubscribe/    # Disiscrizione newsletter
├── components/
│   ├── admin/          # Componenti admin
│   └── ...             # Componenti pubblici
├── lib/                # Utilities e configurazioni
└── types/              # TypeScript types

```

## Licenza

Proprietario: Olio della Contrada
