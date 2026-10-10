// Imported first by api/hen-party-send-invitations.ts: makes src/config.ts
// pick the hen party's event, wording and guest table (it has no page
// address to go by on the server).
;(globalThis as { __INVITE_PAGE?: string }).__INVITE_PAGE = "hen-party"
