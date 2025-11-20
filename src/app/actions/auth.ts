'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'Name, email and password are required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Please enter a valid email address' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    console.warn('Warning: NEXT_PUBLIC_SITE_URL environment variable is not set. Using default: http://localhost:3000');
  }
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email to confirm your account!' }
}

export async function signOut() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}
