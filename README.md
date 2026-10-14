# Trading House AI — MVP

Next.js + OpenAI: interfaccia responsive, 7 agenti, upload screenshot e chat.

## Avvio

1. Installa Node.js 20+
2. `npm install`
3. Copia `.env.example` in `.env.local` e imposta `OPENAI_API_KEY` (non inserirla su GitHub)
4. `npm run dev` e apri `http://localhost:3000`

## Deployment

Collega questo repository a un hosting che supporta Next.js API Routes, ad esempio Vercel. Imposta `OPENAI_API_KEY` nelle variabili d'ambiente del server. GitHub Pages non può eseguire il backend AI.

## Limiti attuali

Questa è una demo tecnica: nessun login, abbonamento, database o rate limiting; i prompt sono generici e non equivalgono alle strategie originali. Non pubblicare l'endpoint senza autenticazione e limiti di spesa. Le immagini inviate sono elaborate tramite OpenAI. Nessun dato di mercato realtime o order flow verificato.
