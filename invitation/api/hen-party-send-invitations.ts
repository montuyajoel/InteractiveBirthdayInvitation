// Vercel serverless function: POST /api/hen-party-send-invitations
// The hen party page's invitation emails: same as api/send-invitations.ts,
// but for the hen party's own guest table, password and wording.
// Keep this import first: it must run before src/config.ts loads.
import "./_lib/hen-party-page.js"
import { POST as send } from "./send-invitations.js"

export const config = { maxDuration: 60 }

export function POST(request: Request) {
  return send(request)
}
