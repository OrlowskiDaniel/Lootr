import { supabase } from '../lib/supabaseClient'

export const uploadAvatar = async (file, userId) => {
  const filePath = `${userId}/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return data.publicUrl
}