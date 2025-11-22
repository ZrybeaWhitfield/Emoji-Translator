# Emoji Translator

A small web app that translates short, kid-friendly phrases into a short "emoji story" using the OpenAI Responses API. The project contains a React/Vite client (`client/`) and an Express server (`server/`).

**Project Layout**
- `client/`: Vite + React front end.
- `server/`: Express API that calls the OpenAI Responses API to produce emoji-only outputs.

**Technical Stack**
- Frontend: React (Vite).
- Backend: Node.js + Express.
- OpenAI: `openai` Responses API (server-side).

**Server Endpoints**
- `POST /translate`
  - Request JSON: `{ "text": "your phrase here" }`
  - Validations: `text` must be a non-empty string and at most 120 characters.
  - Response (200): `{ "emojiPhrase": "...", "userInput": "..." }`
  - Errors: returns 400 for invalid input, 500 for generation failures.

- `GET /health` — returns `{ ok: true, message: "server is healthy" }`.

- `GET /openai-check` — returns `{ ok: <boolean> }` indicating presence of `OPENAI_API_KEY` in environment.

**OpenAI usage**
- The server uses the Responses API and requests a short emoji-only output. Example model used in code: `gpt-4.1-mini` (configurable in `server/index.js`).
- System prompt enforces: output ONLY emojis (no words/punctuation), 4–9 emojis, preserve meaning/order, represent main subject/action/object, prefer concrete emojis.

**Environment Variables**
- `OPENAI_API_KEY` — required for generating emoji translations.
- `PORT` — optional; defaults to `3001`.

**Run locally**
1. Install server deps and start server:

```bash
cd server
npm install
# set OPENAI_API_KEY in your environment, then:
npm start
```

2. Install and run client:

```bash
cd ../client
npm install
npm run dev
```

3. Quick curl test for translation endpoint (replace `localhost:3001` if using a different port):

```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Batman eats a burger"}'
```

Expected response example:

```json
{
  "emojiPhrase": "🦇🧔‍♂️🍽️🍔😋",
  "userInput": "Batman eats a burger"
}
```

**Notes & Development**
- Keep prompts concise and deterministic (low `temperature`) for consistent emoji outputs.
- The server does basic validation; adjust max input length or validation rules in `server/index.js` if needed.
- If you change the OpenAI client usage, ensure `OPENAI_API_KEY` remains server-only.
