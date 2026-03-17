# AstroLumina-Stripe

Un server Node.js cu API Stripe pentru Astro Lumina, care oferă procesare plăți pentru servicii astrologice inclusiv programări, hărți natale și hărți karmice.

## Funcționalități

- **Integrare Stripe**: Procesare securizată a plăților folosind Stripe Checkout
- **Checkout Embedded**: Experiență de plată fluidă cu interfață embedded
- **Servicii Multiple**: Suport pentru plăți programări, hărți natale și hărți karmice
- **Limitare Rate**: Protecție împotriva cererilor excesive (20 cereri pe minut)
- **Configurare CORS**: Cereri cross-origin securizate de la domenii autorizate
- **Configurare bazată pe Environment**: Gestionare securizată a cheilor API și setărilor

## Cerințe Preliminare

- Node.js (v14 sau mai mare)
- npm sau yarn
- Cont Stripe cu chei API
- Produse și prețuri Stripe configurate

## Instalare

1. Clonează repository-ul:
```bash
git clone <repository-url>
cd astro-lumina-stripe
```

2. Instalează dependențele:
```bash
npm install
```

3. Creează un fișier `.env` în directorul rădăcină cu următoarele variabile:
```env
STRIPE_SK=sk_test_... # Cheia secretă Stripe
STRIPE_PK=pk_test_... # Cheia publicabilă Stripe
STRIPE_API_VER=2023-10-16 # Versiunea API Stripe
STRIPE_BOOKING_PRICE=price_... # ID preț pentru serviciul de programare
STRIPE_NATAL_CHART_PRICE=price_... # ID preț pentru harta natală
STRIPE_KARMIC_CHART_PRICE=price_... # ID preț pentru harta karmică
```

## Utilizare

Pornește serverul de dezvoltare:
```bash
npm start
```

Serverul va rula pe `http://localhost:3032`

## Endpoint-uri API

### POST /create-session-booking
Creează o sesiune Stripe checkout pentru serviciile de programare.

**Exemplu de utilizare:**
```bash
curl -X POST http://localhost:3032/create-session-booking \
  -H "Content-Type: application/json"
```

**Răspuns:**
```json
{
  "clientSecret": "cs_test_..."
}
```

### POST /create-session-natal-chart
Creează o sesiune Stripe checkout pentru serviciile de hartă natală.

**Exemplu de utilizare:**
```bash
curl -X POST http://localhost:3032/create-session-natal-chart \
  -H "Content-Type: application/json"
```

**Răspuns:**
```json
{
  "clientSecret": "cs_test_..."
}
```

### POST /create-session-karmic-chart
Creează o sesiune Stripe checkout pentru serviciile de hartă karmică.

**Exemplu de utilizare:**
```bash
curl -X POST http://localhost:3032/create-session-karmic-chart \
  -H "Content-Type: application/json"
```

**Răspuns:**
```json
{
  "clientSecret": "cs_test_..."
}
```

### GET /session-status
Obține statusul unei sesiuni checkout.

**Parametri Query:**
- `session_id`: ID-ul sesiunii Stripe

**Exemplu de utilizare:**
```bash
curl "http://localhost:3032/session-status?session_id=cs_test_..."
```

**Răspuns:**
```json
{
  "status": "complete",
  "payment_status": "paid",
  "customer_email": "customer@example.com"
}
```

## Configurarea Sesiunilor Stripe Checkout

Codul utilizează următoarea configurație pentru crearea sesiunilor Stripe checkout:

```javascript
stripe.checkout.sessions.create({
  ui_mode: 'embedded',            // Mod embedded - checkout integrat în pagină
  line_items: [
    {
      price: STRIPE_PRICE,        // ID-ul prețului din Stripe Dashboard
      quantity: 1,                // Cantitatea (1 pentru servicii individuale)
    },
  ],
  mode: 'payment',                // Mod plată - pentru plăți unice (nu abonamente)
  redirect_on_completion: "never" // Nu redirect după completare, rămâne în pagină
});
```

### Explicația parametrilor:

- **`ui_mode: 'embedded'`**: Creează o experiență de checkout integrată direct în pagina web, fără redirect către Stripe
- **`line_items`**: Lista produselor/serviciilor de cumpărat
  - `price`: ID-ul prețului configurat în Stripe Dashboard (ex: `price_1ABC...`)
  - `quantity`: Numărul de unități (de obicei 1 pentru servicii)
- **`mode: 'payment'`**: Specifică că este o plată unică, nu un abonament recurent
- **`redirect_on_completion: "never"`**: După finalizarea plății, utilizatorul rămâne pe aceeași pagină în loc să fie redirectat

## Dezvoltare

Serverul utilizează:
- **Express.js**: Framework web
- **Stripe Node.js SDK**: Procesare plăți
- **CORS**: Partajare resurse cross-origin
- **express-rate-limit**: Limitare rate cereri
- **dotenv**: Gestionare variabile de mediu
- **nodemon**: Repornire automată în dezvoltare

## Securitate

- Cheile API sunt stocate ca variabile de mediu
- Limitarea rate previne abuzul
- CORS restricționează originile la domenii autorizate
- Gestionarea erorilor previne scurgerea informațiilor sensibile
