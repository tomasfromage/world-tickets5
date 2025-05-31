# Supabase Setup Guide

## 1. Vytvoření Supabase projektu

1. Jdi na [supabase.com](https://supabase.com) a vytvoř nový projekt
2. Poznamenej si **Project URL** a **API Keys**

## 2. Nastavení databáze

1. V Supabase dashboard jdi do **SQL Editor**
2. Spusť SQL skript ze souboru `supabase_schema.sql` pro vytvoření tabulky `events`

## 3. Konfigurace aplikace

1. V souboru `.env.local` doplň své Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Kde najít credentials:**
- Jdi do Project Settings → API
- **URL**: najdeš v sekci "Config"
- **anon key**: najdeš v sekci "Project API keys" jako "anon public"
- **service_role key**: najdeš v sekci "Project API keys" jako "service_role" (používá se pro admin operace)

## 4. Struktura tabulky events

```sql
events (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL,
  total_tickets INTEGER NOT NULL,
  sold_tickets INTEGER DEFAULT 0,
  vendor TEXT NOT NULL,
  event_type TEXT CHECK (event_type IN ('Sport', 'Concert', 'Hackathon', 'Conference', 'Other')),
  image_url TEXT,
  blockchain_event_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

## 5. Row Level Security (RLS)

Tabulka má nastavené RLS políčka:
- **Čtení**: Všichni mohou číst eventy
- **Vkládání**: Pouze authenticated uživatelé
- **Aktualizace**: Uživatelé mohou aktualizovat pouze své eventy

## 6. Testování

Po nastavení můžeš:
1. Spustit aplikaci: `yarn dev`
2. Zkontrolovat konzoli - měly by se načíst eventy z Supabase
3. V Supabase dashboard v **Table Editor** můžeš ručně přidávat/upravovat eventy

## 7. Výhody Supabase řešení

✅ **Rychlost**: Okamžité načítání eventů  
✅ **Flexibilita**: Snadné přidávání nových polí  
✅ **Obrázky**: Podpora pro image_url  
✅ **Real-time**: Možnost real-time aktualizací  
✅ **Škálovatelnost**: Automatické škálování databáze  
✅ **Zabezpečení**: Row Level Security  

## 8. Budoucí vylepšení

- **Real-time subscriptions**: Automatické aktualizace při změnách
- **Image upload**: Direct upload obrázků do Supabase Storage
- **Advanced filtering**: Filtry podle data, lokace, ceny
- **User management**: Propojení s Supabase Auth 