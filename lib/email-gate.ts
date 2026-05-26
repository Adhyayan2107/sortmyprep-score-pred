const KEY = 'sortmyprep_user_email'

export function getStoredEmail(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY)
}

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzS5vGIU_22mNIPSJH3Js5mhlHZhKlAgomjARADwbpJOYlEsVVl2ky4JBB2S-ThKOiKhw/exec'

export function storeEmail(email: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, email)
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ email, timestamp: new Date().toISOString(), source: 'grade-calc' }),
  }).catch(() => {})
}
