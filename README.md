# Root & Reach

A Vue 3 single-page website with an Express JavaScript API for a nonprofit grant writing and major gifts consultancy.

## Run locally

```bash
npm install
npm run dev
```

The Vue client runs at `http://localhost:5173` and proxies API requests to the Express server at `http://localhost:3001`.

## Production

```bash
npm run build
npm start
```

The Express server serves the compiled Vue app from `dist`.

## Deploy to Vercel

The repository includes `vercel.json` and Vercel-native functions in `api/`.

Use these project settings:

- Framework Preset: `Vite`
- Root Directory: `.`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: `22.x`

Create a Resend account, verify the sending domain, and add these Vercel environment variables for Production, Preview, and Development:

- `RESEND_API_KEY`
- `INQUIRY_TO_EMAIL`
- `INQUIRY_FROM_EMAIL`

Use `.env.example` as the local reference. The Vercel function emails each inquiry to the configured recipient and sets the visitor's address as the reply-to address.

## Partner logo sources

Logo files in `public/partners` were retrieved from the organizations' official websites:

- The Bridge Over Troubled Waters: https://tbotw.org/
- Jane Around the World: https://janearoundtheworld.org/
- Bay Area Turning Point: https://www.bayareaturningpoint.org/
- The Wheelhouse: https://thewheelhouse.org/
