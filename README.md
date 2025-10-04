# CRM Assistant MVP (Cursor-ready)

## Setup

1. Copy this folder into Cursor workspace.
2. `npm install`
3. Create a `.env` file from `env.example` and set `SUPABASE_URL` and `SUPABASE_KEY`.
4. Ensure Supabase table `contacts` exists. Example SQL:

```sql
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  revenue numeric default 0,
  created_at timestamp with time zone default timezone('utc', now())
);
```

5. `npm run dev` (or `npm start`)

## Test endpoints

* Health: `GET http://localhost:3000/health`
* Get contacts: `GET http://localhost:3000/contacts?limit=10`
* Add contact: `POST http://localhost:3000/contacts` with JSON `{ "name": "Zee", "email": "z@x.com", "company":"Acme", "revenue": 1200 }`
* Top clients: `GET http://localhost:3000/top-clients?limit=5`
* Search: `GET http://localhost:3000/search?q=zee`

## Using with Cursor AI / MCP

1. Open Cursor and point its AI tool manifest to `mcp-tool.json` (or paste the manifest in the AI tool panel).
2. Ask the AI: "Show me top 3 clients by revenue" — AI should call `/top-clients?limit=3` and return structured JSON.
3. Ask: "Add a contact named Rohit with email rohit@x.co and company RCo" — AI should POST to `/contacts`.

---

## Example AI prompts (copy-paste)

* `Get top 5 clients by revenue from crm_assistant`
* `Add contact: name=Anita, email=anita@biz.com, company=Biz, revenue=5000`
* `Search contacts for "Zeeshan"`

---

Happy vibecoding! Agar chahiye toh main yeh repo ko TypeScript version ya Next.js frontend ke saath bhi bana dunga.
