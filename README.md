# Kyles Grant Studio

A Vue 3 single-page website with an Express JavaScript API for a nonprofit grant writing and development consultancy.

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

## Partner logo sources

Logo files in `public/partners` were retrieved from the organizations' official websites:

- The Bridge Over Troubled Waters: https://tbotw.org/
- Jane Around the World: https://janearoundtheworld.org/
- Bay Area Turning Point: https://www.bayareaturningpoint.org/
- The Wheelhouse: https://thewheelhouse.org/
