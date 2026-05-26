const KEY = 'sortmyprep_user_email'

export function getStoredEmail(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY)
}

export function storeEmail(email: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, email)
}
