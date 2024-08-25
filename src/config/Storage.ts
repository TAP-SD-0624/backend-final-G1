import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()
export const supbaseClient = createClient(
  process.env.STORATE_URL as string,
  process.env.STORATE_KEY as string
)
