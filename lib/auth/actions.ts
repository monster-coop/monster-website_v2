import { createClient } from '@/lib/supabase/server'


export async function getCurrentUser() {
    const supabase = await createClient()
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error getting user server:', error)
        return null
      }
      
      return user
    } catch (error) {
      console.error('Get user error server:', error)
      return null
    }
  }