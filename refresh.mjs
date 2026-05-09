import { requireConfig } from './services/instagram.ts'
import { refreshInstagramToken } from './lib/refresh-instagram-token.ts'
import { getSupabaseAdminClient } from './lib/supabase-admin.ts'
// Wait, I can't easily run TypeScript without ts-node or next/babel.
