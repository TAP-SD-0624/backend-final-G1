import { createClient } from '@supabase/supabase-js'

export const supbaseClient = createClient(
  'https://xkmwxgcmqiudsimmoqlb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbXd4Z2NtcWl1ZHNpbW1vcWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4Njk0MDcsImV4cCI6MjAzODQ0NTQwN30.wZI2jKlDPtbfjW5gU2l13bNfslcMHfNUeNY5yftZN6A'
)
